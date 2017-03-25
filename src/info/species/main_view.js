/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'backbone.marionette';
import JST from 'JST';
import 'jquery-touchswipe';
import Device from 'helpers/device';
import Gallery from '../../common/gallery';
import './styles.scss';
import './data/maps/loader';
import './data/images/loader';
import './data/timelines/loader';

export default Marionette.View.extend({
  template: JST['info/species/main'],

  events: {
    'click #species-map': 'toggleMap',
    'click #species-map-button': 'toggleMap',
    'click #gallery-button': 'photoView',
    'click .images .img': 'photoView',
    'click #sample-btn': 'sample',
  },

  onAttach() {
    // photos
    this.startSwipe();

    // add Map
    const $mapsHolder = $('#maps-holder');
    $.get(`images/${this.model.id}.svg`, function(data) {
      const svg = data.documentElement ?
        new XMLSerializer().serializeToString(data.documentElement) : data;
      $mapsHolder.append(svg);
    });
  },

  startSwipe() {
    const that = this;
    const WIDTH = $('#species_gallery').width();
    let currentImg = 0;
    const maxImages = this.model.get('photos');
    const speed = 500;
    let imgs = null;

    /**
     * Catch each phase of the swipe.
     * move : we drag the div
     * cancel : we animate back to where we were
     * end : we animate to the next image
     */
    function swipeStatus(event, phase, direction, distance) {
      // If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
      if (phase === 'move' && (direction === 'left' || direction === 'right')) {
        var duration = 0;

        if (direction === 'left') {
          scrollImages((WIDTH * currentImg) + distance, duration);
        } else if (direction == 'right') {
          scrollImages((WIDTH * currentImg) - distance, duration);
        }

      } else if (phase === 'cancel') {
        scrollImages(WIDTH * currentImg, speed);
      } else if (phase === 'end') {
        if (direction === 'right') {
          previousImage();
        } else if (direction === 'left') {
          nextImage();
        }
      }
    }

    function previousImage() {
      currentImg = Math.max(currentImg - 1, 0);
      scrollImages(WIDTH * currentImg, speed);
      updateCircleProgress(currentImg);
    }

    function nextImage() {
      currentImg = Math.min(currentImg + 1, maxImages - 1);
      scrollImages(WIDTH * currentImg, speed);
      updateCircleProgress(currentImg);
    }

    /**
     * Manually update the position of the imgs on drag
     */
    function scrollImages(distance, duration) {
      imgs.css('transition-duration', (duration / 1000).toFixed(1) + 's');

      //inverse the number we set in the css
      var value = (distance < 0 ? '' : '-') + Math.abs(distance).toString();
      imgs.css('transform', 'translate(' + value + 'px,0)');
    }

    function updateCircleProgress(number) {
      $progressCircles.each((id, circle) => {
        if ($(circle).data('id') !== number) {
          $(circle).removeClass('circle-full');
        } else {
          $(circle).addClass('circle-full');
        }
      });
    }

    const swipeOptions = {
      triggerOnTouchEnd: false,
      swipeStatus,
      allowPageScroll: 'vertical',
      threshold: 75,
    };

    const $img = $('#species_gallery .images .img');
    $img.css('width', WIDTH);

    const $progressCircles = this.$el.find('.gallery .progress div');

    $(() => {
      imgs = $('#species_gallery .images');
      imgs.width(maxImages * WIDTH);
      imgs.swipe(swipeOptions);

      /**
       * Tap handler for touchswipe does not work on Desktop computers -
       * it is always fired even if we are swiping.
       * Therfore, we disable gallery launch for non touch devices.
       */
      if (Device.isMobile()) {
        imgs.find('img').on('tap', () => {
          const id = $(this).data('id');
          that.showGallery(id);
        });
      }
    });
  },

  sample() {
    this.trigger('sample');
  },

  /**
   * Shows/hides the distribution map.
   */
  toggleMap() {
    this.$el.find('#species-map').toggle('slow');
  },

  /**
   * Launches the species gallery viewing.
   */
  photoView() {
    const items = [];
    const options = {};

    const photos = this.model.get('photos');
    const author = this.model.get('author') || [];
    const width = this.model.get('width') || [];
    const height = this.model.get('height') || [];

    for (let i = 0; i < photos; i++) {
      let title;
      if (author[i]) {
        title = `&copy; ${author[i]}`;
      }
      items.push({
        src: `images/${this.model.id}_${i}.jpg`,
        w: width[i] || 800,
        h: height[i] || 800,
        title,
      });
    }

    // Initializes and opens PhotoSwipe
    var gallery = new Gallery(items, options);
    gallery.init();
  },

});
