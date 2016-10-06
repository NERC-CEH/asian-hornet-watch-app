<% if (obj.name) { %>
<label class="item item-radio" style="background-image: url(images/<%- obj.pic %>)">
  <input type="radio" name="group" value="<%- obj.id %>" <%- obj.selected ? 'checked' : ''%>>

  <% } else { %>
  <label class="item item-radio other">
    <% } %>
    <div class="radio-content">
      <div class="item-content">
        <%- obj.name || 'Other' %>
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
    <% if (obj.name) { %>
    <a href="#info/species/<%- obj.id %>">
      <span class="media-object pull-left icon icon-info"></span>
    </a>
    <% } %>
  </label>