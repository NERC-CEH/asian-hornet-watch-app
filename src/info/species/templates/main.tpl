<div class="gallery" id="species_gallery">
  <div class="images">
    <% for (var i = 0; i < obj.photos; i++) { %>
    <div class="img photo" style="background-image: url('images/<%= obj.id + '_' + i + '.jpg' %>')" alt="&copy; <%= obj.author[i] %>"></div>
    <% } %>
  </div>
  <div class="progress">
    <% for (var i = 0; i < obj.photos; i++) { %>
    <div class="circle <%- i === 0 ? 'circle-full' : '' %>" data-id="<%- i %>"></div>
    <% } %>
  </div>
</div>

<div class="segmented-control no-border">
  <a id="gallery-button" class="control-item icon icon-camera">Gallery</a>
  <a id="species-map-button" class="control-item icon icon-map">Distribution</a>
</div>

<ul id="species-info" class="table-view">
  <li>
    <div class="common-name"><%= obj.common_name %></div>
    <div class="taxon"><%= obj.scientific_name %></div>
  </li>
  <li id="species-map" style="display: none">
    <div id="maps-holder" style="display:none"></div>
    <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      <use id="species-map-data" xlink:href="#data"/>
      <g id="legend">
        <text dy="15" x="30" y="0" style="font-size: normal">Main area</text>
        <rect width="20" height="20" fill="#FFC019" y="0" x="0"></rect>
      </g>
    </svg>
  </li>

  <li id="timeline"><img src="images/<%- obj.timeline %>" alt=""></li>

  <li>
    <% if (obj.size) { %>
    <p>
      <strong>Size:</strong>
      <span><%= obj.size %></span>
    </p>
    <% } %>

    <% if (obj.legs) { %>
    <p>
      <strong>Legs:</strong>
      <span><%= obj.legs %></span>
    </p>
    <% } %>


    <% if (obj.abdomen) { %>
    <p>
      <strong>Abdomen:</strong>
      <span><%= obj.abdomen %></span>
    </p>
    <% } %>


    <% if (obj.head) { %>
    <p>
      <strong>Head:</strong>
      <span><%= obj.head %></span>
    </p>
    <% } %>


    <% if (obj.antennae) { %>
    <p>
      <strong>Antennae:</strong>
      <span><%= obj.antennae %></span>
    </p>
    <% } %>


    <% if (obj.thorax) { %>
    <p>
      <strong>Thorax:</strong>
      <span><%= obj.thorax %></span>
    </p>
    <% } %>

    <% if (obj.notes) { %>
    <p>
      <strong>Other features:</strong>
      <span><%= obj.notes %></span>
    </p>
    <% } %>
  </li>

  <% if (obj.id === 1 || obj.id === 2) { %>
  <li class="table-view-cell">
    <a href="#info/species/comparison" class="navigate-right btn-small">
      <span class="media-object pull-left icon icon-eye"></span>
      Compare Species
    </a>
  </li>
  <% } %>

  <li id="species-description">
    <p><%= obj.description %></p>
  </li>
</ul>
