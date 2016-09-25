/** ****************************************************************************
 * Setting Menu main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import { Device } from 'helpers';
import JST from 'JST';

export default Marionette.View.extend({
  tagName: 'ul',
  className: 'table-view',
  template: JST['settings/menu/main'],

  events: {
    'toggle #use-autosync-btn': 'onSettingToggled',
    'click #use-autosync-btn': 'onSettingToggled',
  },

  triggers: {
    'click #delete-all-btn': 'records:delete:all',
    'click #submit-all-btn': 'records:submit:all',
    'click #app-reset-btn': 'app:reset',
  },

  onSettingToggled(e) {
    const setting = $(e.currentTarget).data('setting');
    let active = $(e.currentTarget).hasClass('active');

    if (e.type !== 'toggle' && !Device.isMobile()) {
      // Device.isMobile() android generates both swipe and click

      active = !active; // invert because it takes time to get the class
      $(e.currentTarget).toggleClass('active', active);
    }

    this.trigger('setting:toggled', setting, active);
  },

  serializeData() {
    const appModel = this.model;
    return {
      useGridRef: appModel.get('useGridRef'),
      useGridMap: appModel.get('useGridMap'),
      autosync: appModel.get('autosync'),
    };
  },
});
