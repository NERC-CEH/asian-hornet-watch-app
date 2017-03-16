/** ****************************************************************************
 * Sample Show main view.
 *****************************************************************************/
import Indicia from 'indicia';
import Marionette from 'backbone.marionette';
import JST from 'JST';
import CONFIG from 'config';
import DateHelp from 'helpers/date';
import StringHelp from 'helpers/string';
import Gallery from '../../common/gallery';
import './styles.scss';

export default Marionette.View.extend({
  template: JST['samples/show/main'],

  events: {
    'click img': 'photoView',
  },

  photoView(e) {
    e.preventDefault();

    const items = [];
    const sample = this.model.get('sample');
    sample.getOccurrence().media.each((image) => {
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

  serializeData() {
    const sample = this.model.get('sample');
    const occ = sample.getOccurrence();
    const specie = occ.get('taxon');

    // taxon
    const scientificName = specie.scientific_name;
    const commonName = specie.common_name;

    const syncStatus = sample.getSyncStatus();

    const locationPrint = sample.printLocation();
    const location = sample.get('location') || {};

    let number = occ.get('number') && StringHelp.limit(occ.get('number'));
    if (!number) {
      number = occ.get('number-ranges') && StringHelp.limit(occ.get('number-ranges'));
    }

    return {
      id: occ.id,
      cid: occ.cid,
      site_url: CONFIG.site_url,
      isSynchronising: syncStatus === Indicia.SYNCHRONISING,
      onDatabase: syncStatus === Indicia.SYNCED,
      scientific_name: scientificName,
      commonName,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(sample.get('date'), true),
      number,
      comment: occ.get('comment'),
      media: occ.media,
    };
  },
});

