<div class="input-group">
  <div class="input-row">
    <label class="media-object pull-left icon icon-address"></label>
    <input id="location-name" name="name" type="text" placeholder="Location Name" value="<%- obj.name %>">
  </div>
  <div class="table-view-cell">
    Favourite
    <div id="favourite-btn" data-setting="favourite"
         class="toggle no-yes <%- obj.favourite ? 'active' : '' %>">
      <div class="toggle-handle"></div>
    </div>
  </div>
</div>
