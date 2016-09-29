/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Morel from 'morel';
import Marionette from 'marionette';
import JST from 'JST';
import { DateHelp, StringHelp } from 'helpers';
import Gallery from '../../common/gallery';
import './styles.scss';

export default Marionette.View.extend({
  template: JST['records/show/main'],

  events: {
    'click img': 'photoView',
  },

  photoView(e) {
    e.preventDefault();

    const items = [];
    const recordModel = this.model.get('recordModel');
    recordModel.occurrences.at(0).images.each((image) => {
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
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences.at(0);
    const specie = occ.get('taxon');

    // taxon
    const scientificName = specie.scientific_name;
    const commonName = specie.common_name;

    const syncStatus = recordModel.getSyncStatus();

    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    let number = occ.get('number') && StringHelp.limit(occ.get('number'));
    if (!number) {
      number = occ.get('number-ranges') && StringHelp.limit(occ.get('number-ranges'));
    }

    return {
      id: occ.cid,
      isSynchronising: syncStatus === Morel.SYNCHRONISING,
      onDatabase: syncStatus === Morel.SYNCED,
      scientific_name: scientificName,
      commonName,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(recordModel.get('date')),
      number,
      comment: occ.get('comment'),
      images: occ.images,
    };
  },
});

