/** ****************************************************************************
 * Record List main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'backbone.marionette';
import Morel from 'morel';
import Hammer from 'hammerjs';
import { Log, StringHelp, Device, DateHelp } from 'helpers';
import JST from 'JST';
import CONFIG from 'config';
import Gallery from '../../common/gallery';
import './styles.scss';

const RecordView = Marionette.View.extend({
  tagName: 'li',
  className: 'table-view-cell swipe',

  triggers: {
    'click #delete': 'record:delete',
  },

  events: {
    // need to pass the attribute therefore 'triggers' method does not suit
    'click .js-attr': (e) => {
      e.preventDefault();
      this.trigger('record:edit:attr', $(e.target).data('attr'));
    },
    'click img': 'photoView',
  },

  modelEvents: {
    'request sync error': 'render',
    geolocation: 'render',
  },

  initialize() {
    this.template = JST['records/list/record'];
  },

  photoView(e) {
    e.preventDefault();

    const items = [];

    this.model.occurrences.at(0).images.each((image) => {
      items.push({
        src: image.getURL(),
        w: image.get('width') || 800,
        h: image.get('height') || 800,
      });
    });

    // Initializes and opens PhotoSwipe
    const gallery = new Gallery(items);
    gallery.init();
  },

  onRender() {
    Log('Records:List:MainView: rendering a record');

    // add mobile swipe events
    // early return
    if (!Device.isMobile()) return;

    this.$record = this.$el.find('a');
    this.docked = false;
    this.position = 0;

    const options = {
      threshold: 50,
      toolsWidth: 100,
    };

    const hammertime = new Hammer(this.el, { direction: Hammer.DIRECTION_HORIZONTAL });
    const that = this;

    // on tap bring back
    this.$record.on('tap click', $.proxy(this._swipeHome, this));

    hammertime.on('pan', (e) => {
      e.preventDefault();
      that._swipe(e, options);
    });
    hammertime.on('panend', (e) => {
      that._swipeEnd(e, options);
    });
  },

  remove() {
    Log('Records:MainView: removing a record');
    // removing the last element leaves emptyView + fading out entry for a moment
    if (this.model.collection && this.model.collection.length >= 1) {
      const that = this;
      this.$el.addClass('shrink');
      setTimeout(() => {
        Marionette.View.prototype.remove.call(that);
      }, 300);
    } else {
      Marionette.View.prototype.remove.call(this);
    }
  },

  serializeData() {
    const recordModel = this.model;
    const occ = recordModel.occurrences.at(0);
    const date = DateHelp.print(recordModel.get('date'));
    const specie = occ.get('taxon') || {};
    const images = occ.images;
    const img = images.length && images.at(0).get('thumbnail');

    const taxon = `${specie.common_name} ${specie.common_name_significant}`;

    const syncStatus = this.model.getSyncStatus();

    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    const number = occ.get('number') && StringHelp.limit(occ.get('number'));

    return {
      id: recordModel.id || recordModel.cid,
      saved: recordModel.metadata.saved,
      onDatabase: syncStatus === Morel.SYNCED,
      isLocating: recordModel.isGPSRunning(),
      location: locationPrint,
      location_name: location.name,
      isSynchronising: syncStatus === Morel.SYNCHRONISING,
      date,
      taxon,
      number,
      stage: occ.get('stage') && StringHelp.limit(occ.get('stage')),
      comment: occ.get('comment'),
      img: img ? `<img src="${img}"/>` : '',
    };
  },

  _swipe(e, options) {
    // only swipe if no scroll up
    if (Math.abs(e.deltaY) > 10) return;

    if (this.docked) {
      this.position = -options.toolsWidth + e.deltaX;
    } else {
      this.position = e.deltaX;
    }

    // protection of swipeing right too much
    if (this.position > 0) this.position = 0;

    this.$record.css('transform', `translateX(${this.position}px)`);
  },

  _swipeEnd(e, options) {
    // only swipe if no scroll up and is not in the middle
    if (Math.abs(e.deltaY) > 10 && !this.position) return;

    if ((-options.toolsWidth + e.deltaX) > -options.toolsWidth) {
      // bring back
      this.position = 0;
      this.docked = false;
    } else {
      // open tools
      this.docked = true;
      this.position = -options.toolsWidth;
    }

    this.$record.css('transform', `translateX(${this.position}px)`);
  },

  _swipeHome(e) {
    if (this.docked) {
      e.preventDefault();
      this.position = 0;
      this.$record.css('transform', `translateX(${this.position}px)`);
      this.docked = false;
    }
  },
});

const NoRecordsView = Marionette.View.extend({
  tagName: 'li',
  className: 'table-view-cell empty',
  template: JST['records/list/list-none'],
});

export default Marionette.CompositeView.extend({
  id: 'user-records-list',
  template: JST['records/list/main'],
  childViewContainer: '#records-list',
  emptyView: NoRecordsView,
  childView: RecordView,

  serializeData() {
    return {
      loggedIn: this.options.userModel.hasLogIn(),
      statistics_url: CONFIG.statistics.url,
    };
  },
});
