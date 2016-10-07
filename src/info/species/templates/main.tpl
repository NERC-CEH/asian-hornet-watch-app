<div class="gallery" id="species_gallery">
  <div class="images">
    <% for (pic in obj.photo) { %>
    <div class="img photo" style="background-image: url('images/<%= obj.photo[pic] %>')" alt="&copy; <%= obj.pic_author %>"></div>
    <% } %>
  </div>
  <div class="progress">
    <% obj.photo.forEach(function(pic, i) { %>
    <div class="circle <%- i === 0 ? 'circle-full' : '' %>" data-id="<%- i %>"></div>
    <% }) %>
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
        <rect width="20" height="20" fill="#42423e" y="0" x="0"></rect>
        <text dy="15" x="30" y="30" style="font-size: normal">Individual records</text>
        <rect width="20" height="20" fill="#FFC019" y="30" x="0"></rect>
      </g>
    </svg>
  </li>

  <% if (obj.timeline) { %>
  <li id="timeline"><img src="images/<%- obj.timeline %>" alt=""></li>
  <% } %>

  <li id="species-description">
  <p><%= obj.description %></p>
</li>

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
      <span><%= obj.notes %></span>
    </p>
    <% } %>
  </li>


  <!--<li class="table-view-cell">-->
  <!--<a id="record-btn" class="navigate-right btn-small">-->
  <!--<span class="media-object pull-left icon icon-plus"></span>-->
  <!--Record Species-->
  <!--</a>-->
  <!--</li>-->
</ul>
