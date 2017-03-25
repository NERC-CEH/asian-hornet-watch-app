<label class="item item-radio" style="background-image: url(images/<%- obj.pic %>)">
  <% if (obj.sampleModel) { %>
  <input type="radio" name="group" value="<%- obj.id %>" <%- obj.selected ? 'checked' : ''%>>
  <% } %>
  <div class="radio-content">
    <div class="item-content">
      <%- obj.name %>
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
  <% if (!obj.other) { %>
  <a href="#info/species/<%- obj.id %>">
    <span class="media-object pull-left icon icon-info"></span>
  </a>
  <% } %>
  <% if (obj.id === 1) { %>
  <span id="hornet-warning" class="media-object pull-left icon icon-warn"></span>
  <% } %>
</label>
