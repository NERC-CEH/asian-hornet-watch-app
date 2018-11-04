<div class="app-logo">
  <img src="images/app_logo.png">
</div>

<div id="intro-snippet">
  Learn more about Asian hornet and help detect it by recording suspected sightings.
</div>

<ul id="buttons" class="table-view buttons">
  <li class="table-view-cell">
    <a href="#info/species" class="navigate-right">
      <span class="media-object pull-left icon icon-wasp"></span>
      Check your ID
    </a>
  </li>
  <li class="table-view-cell">
    <a id="sample-btn" class="navigate-right">
      <span class="media-object pull-left icon icon-plus"></span>
      Record
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info" class="navigate-right">
      <span class="media-object pull-left icon icon-info"></span>
      <% if (obj.samples > 0) { %>
      <span class="badge <%- obj.needSync ? 'error' : '' %>"><%- obj.samples %></span>
      <% } %>
      App Info
    </a>
  </li>
</ul>

