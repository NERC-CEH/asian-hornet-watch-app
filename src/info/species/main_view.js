/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from '../../../JST';
import 'touchswipe/js/jquery.touchSwipe.min';
import Gallery from '../../common/gallery';
import { Device } from 'helpers';

export default Marionette.ItemView.extend({
  template: JST['species/account/main'],

  events: {
    'click #species-map': 'toggleMap',
    'click #species-map-button': 'toggleMap',
    'click #gallery-button': 'photoView',
    'click .images .img': 'photoView',
    'click #record-btn': 'record',
  },

  onShow() {
    // photos
    this.startSwipe();

    // add Map
    var $mapsHolder = $('#maps-holder');
    $.get("images/country_coastline.svg", function(data) {
      const svg = data.documentElement ?
        new XMLSerializer().serializeToString(data.documentElement) : data;
      $mapsHolder.append(svg);
    });
    $.get(this.model.attributes.map, function(data) {
      const svg = data.documentElement ?
        new XMLSerializer().serializeToString(data.documentElement) : data;
      $mapsHolder.append(svg);
    });
  },

  startSwipe() {
    var that = this,
        WIDTH = $('#species_gallery').width(),
        currentImg = 0,
        maxImages = this.model.get('illustration') ? 2 : 1,
        speed = 500,
        imgs = null,

        swipeOptions = {
          triggerOnTouchEnd: false,
          swipeStatus: swipeStatus,
          allowPageScroll: "vertical",
          threshold: 75
        };

    var $img = $('#species_gallery .images .img');
    $img.css('width', WIDTH);

    var $progressCircles = this.$el.find('.gallery .progress div');

    $(function () {
      imgs = $('#species_gallery .images');
      imgs.width(maxImages * WIDTH);
      imgs.swipe(swipeOptions);

      /**
       * Tap handler for touchswipe does not work on Desktop computers -
       * it is always fired even if we are swiping.
       * Therfore, we disable gallery launch for non touch devices.
       */
      if (Device.isMobile()) {
        imgs.find('img').on('tap', function (e) {
          var id = $(this).data('id');
          that.showGallery(id);
        });
      }
    });


    /**
     * Catch each phase of the swipe.
     * move : we drag the div
     * cancel : we animate back to where we were
     * end : we animate to the next image
     */
    function swipeStatus(event, phase, direction, distance) {
      //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
      if (phase == "move" && (direction == "left" || direction == "right")) {
        var duration = 0;

        if (direction == "left") {
          scrollImages((WIDTH * currentImg) + distance, duration);
        } else if (direction == "right") {
          scrollImages((WIDTH * currentImg) - distance, duration);
        }

      } else if (phase == "cancel") {
        scrollImages(WIDTH * currentImg, speed);
      } else if (phase == "end") {
        if (direction == "right") {
          previousImage();
        } else if (direction == "left") {
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
      imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");

      //inverse the number we set in the css
      var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
      imgs.css("transform", "translate(" + value + "px,0)");
    }

    var updateCircleProgress = function(number) {
      $progressCircles.each(function () {
        if ($(this).data('id') !== number) {
          $(this).removeClass('circle-full');
        } else {
          $(this).addClass('circle-full');
        }
      })
    }
  },

  record() {
    this.trigger('record');
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
  photoView(view, e) {
    const items = [];
    const options = {};

    let title;

    const author = this.model.get('profile_pic_author');
    if (author) {
      title = `&copy; ${author}`;
    }

    items.push({
      src: this.model.get('profile_pic'),
      w: this.model.get('profile_pic_width') || 800,
      h: this.model.get('profile_pic_height') || 800,
      title,
    });

    if (this.model.get('illustration')) {
      items.push({
        src: this.model.get('illustration'),
        w: this.model.get('illustration_width') || 800,
        h: this.model.get('illustration_height') || 800,
      });
    }

// Initializes and opens PhotoSwipe
    var gallery = new Gallery(items, options);
    gallery.init();
  },

});
