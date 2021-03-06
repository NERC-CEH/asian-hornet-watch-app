<% if (obj.training) { %>
<div class="main-header training">Training</div>
<% } %>
<div class="warning-message">
  <p>Caution: take care when recording this species as its sting is similar to that of a wasp</p>
</div>
<ul class="table-view core inputs no-top <%- obj.isSynchronising ? 'disabled' : '' %>">
  <li class="table-view-divider" style="margin-top: 0">Please fill in the details.</li>
  <li class="table-view-cell">
    <a href="#samples/<%- obj.id %>/edit/taxon" id="species-button" class="navigate-right">
      <span class="media-object pull-left icon icon-wasp"></span>
      <% if (obj.commonName) { %>
      <span class="media-object pull-right descript"><%- obj.commonName %></span>
      <% } else { %>
      <span class="media-object pull-right descript warn">required</span>
      <% } %>
      Species
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#samples/<%- obj.id %>/edit/location" id="location-button" class="navigate-right">
      <span class="media-object pull-left icon icon-location"></span>

      <% if (obj.location_name) { %>
      <span class="media-object pull-right descript"><%= obj.location_name %></span>
      <% } %>

      <% if (obj.location) { %>
      <span class="media-object pull-right descript"><%- obj.location %></span>
      <% } else { %>
      <% if (obj.isLocating) { %>
      <span class="media-object pull-right descript warn">Locating...</span>
      <% } else { %>
      <span class="media-object pull-right descript warn">required</span>
      <% } %>
      <% } %>
      Location
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#samples/<%- obj.id %>/edit/date" id="date-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-calendar"></span>
      <span class="media-object pull-right descript"><%- obj.date %></span>
      Date
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#samples/<%- obj.id %>/edit/number" id="number-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-number"></span>
      <span class="media-object pull-right descript"><%- obj.number %></span>
      Number
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#samples/<%- obj.id %>/edit/comment" id="comment-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-comment"></span>
      <span class="media-object pull-right descript"><%= obj.comment %></span>
      Comment
    </a>
  </li>
</ul>
