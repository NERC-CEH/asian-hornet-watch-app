<div class="app-logo">
  <img src="images/app_logo.png">
</div>

<div id="intro-snippet">
  Help detect the non-native Asian Hornet and record our native hornets and their
  look-alikes so we can update their status and distribution in the UK.
</div>

<ul id="buttons" class="table-view buttons">
  <li class="table-view-cell">
    <a id="record-btn" class="navigate-right">
      <span class="media-object pull-left icon icon-plus"></span>
      Record
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info" class="navigate-right">
      <span class="media-object pull-left icon icon-info"></span>
      <% if (obj.records > 0) { %>
      <span class="badge <%- obj.needSync ? 'error' : '' %>"><%- obj.records %></span>
      <% } %>
      App Info
    </a>
  </li>
</ul>

