<label class="item item-radio" style="background-image: url(images/<%- obj.pic %>)">
  <input type="radio" name="group" value="<%- obj.id %>" <%- obj.selected ? 'checked' : ''%>>
  <div class="radio-content">
    <div class="item-content">
      <%- obj.name %>
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
  <% if (obj.name != 'Other') { %>
  <a href="#info/species/<%- obj.id %>">
    <span class="media-object pull-left icon icon-info"></span>
  </a>
  <% } %>
</label>