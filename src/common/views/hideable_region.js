import Marionette from 'marionette';

export default Marionette.Region.extend({
  show(...args) {
    this.$el.show();
    Marionette.Region.prototype.show.apply(this, args);
  },

  hide() {
    this.$el.hide();
    return this;
  },
});
