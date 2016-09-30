/** ****************************************************************************
 * Record Edit footer view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import _ from 'lodash';
import Morel from 'morel';
import JST from 'JST';
import Gallery from '../../common/gallery';

const SavedImageView = Marionette.View.extend({
  template: _.template('<span class="delete icon icon-cancel">' +
    '</span><img src="<%- obj.data %>" alt="">'),
  className: 'img',

  events: {
    'click span.delete': 'delete',
    'click img': 'photoView',
  },

  photoView() {
    this.trigger('photo:view', this);
  },

  delete() {
    this.trigger('photo:delete', this);
  },

  serializeData() {
    return {
      data: this.model.getURL(),
    };
  },
});

const EmptyView = Marionette.View.extend({
  template: JST['records/edit/image_picker_empty'],
  tagName: 'span',
  className: 'empty',
});

export default Marionette.CompositeView.extend({
  id: 'edit-footer',
  template: JST['records/edit/image_picker_array'],
  initialize() {
    this.collection = this.model.occurrences.at(0).images;
  },

  events: {
    'change input': 'photoUpload',
  },

  photoUpload(e) {
    this.trigger('photo:upload', e);
  },

  childViewContainer: '#img-array',
  childView: SavedImageView,

  emptyView: EmptyView,

  modelEvents: {
    'request sync error': 'render',
  },

  serializeData() {
    return {
      isSynchronising: this.model.getSyncStatus() === Morel.SYNCHRONISING,
    };
  },

  onChildviewPhotoView(view) {
    const items = [];
    const options = {};

    this.collection.each((image, index) => {
      if (image.cid === view.model.cid) options.index = index;

      items.push({
        src: image.getURL(),
        w: image.get('width') || 800,
        h: image.get('height') || 800,
      });
    });

// Initializes and opens PhotoSwipe
    const gallery = new Gallery(items, options);
    gallery.init();
  },

  onAttach() {
    const that = this;

    // create camera/gallery selection
    if (window.cordova) {
      this.$el.find('.img-picker input').remove();

      this.$el.find('.img-picker').on('click', () => {
        that.trigger('photo:selection');
      });
    }
  },
});
