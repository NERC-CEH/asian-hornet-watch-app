/** ****************************************************************************
 * Record Attribute main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import { Device, DateHelp, StringHelp, Log } from 'helpers';
import JST from 'JST';

export default Marionette.View.extend({
  initialize(options) {
    if (options.attr === 'fine-habitat') {
      this.template = this.generateTemplate(options.attr);
      return;
    }
    this.template = JST[`records/attr/${options.attr}`];
  },

  triggers: {
    'click input[type="radio"]': 'save',
  },

  getValues() {
    const values = {};
    let value;
    const attr = this.options.attr;
    let $inputs;
    switch (attr) {
      case 'date': {
        value = this.$el.find('input').val();
        const date = new Date(value);
        if (date.toString() !== 'Invalid Date') {
          values[attr] = new Date(date);
        }
        break;
      }
      case 'number':
        $inputs = this.$el.find('input[type="radio"]');
        $inputs.each((int, elem) => {
          if ($(elem).prop('checked')) {
            values.number = $(elem).val();
          }
        });
        break;
      case 'comment':
        value = this.$el.find('textarea').val();
        values[attr] = StringHelp.escape(value);
        break;
      default:
    }

    return values;
  },

  serializeData() {
    const templateData = {};
    const occ = this.model.occurrences.at(0);

    switch (this.options.attr) {
      case 'date':
        templateData.date = DateHelp.toDateInputValue(this.model.get('date'));
        templateData.maxDate = DateHelp.toDateInputValue(new Date());
        break;
      case 'number': {
        let number = occ.get('number');
        number = occ.get('number') || 'default';
        templateData[number] = true;
        break;
      }
      case 'comment':
        templateData.comment = this.model.get('comment');
        break;
      default:
        Log('Records:Attribute:MainView: no such attribute', 'e');
        return null;
    }

    return templateData;
  },

  onAttach() {
    let $input;
    switch (this.options.attr) {
      case 'date':
        $input = this.$el.find('input').focus();
        if (Device.isAndroid()) {
          const options = {
            date: new Date(this.model.get('date')),
            mode: 'date',
            androidTheme: 5,
            allowOldDates: true,
            allowFutureDates: false,
          };

          window.datePicker.show(options, (date) => {
            $input.val(DateHelp.toDateInputValue(new Date(date)));
          });
        }
        break;
      case 'comment':
        $input = this.$el.find('textarea').focus();
        if (window.cordova && Device.isAndroid()) {
          window.Keyboard.show();
          $input.focusout(() => {
            window.Keyboard.hide();
          });
        }
        break;
      default:
    }
  },
});

