<div class="gallery" id="species_gallery">
  <div class="images">
    <div class="img photo" style="background-image: url('<%= obj.profile_pic %>')" alt="&copy; <%= obj.profile_pic_author %>"></div>
    <% if (obj.illustration) { %>
    <div class="img">
      <img class="illustration" src="<%= obj.illustration %>" data-id="1">
    </div>
    <% } %>
  </div>
  <% if (obj.illustration) { %>
  <div class="progress">
    <div class="circle circle-full" data-id="0"></div>
    <div class="circle" data-id="1"></div>
  </div>
  <% }; %>
</div>

<div class="segmented-control no-border">
  <a id="gallery-button" class="control-item icon icon-eye">Gallery</a>
  <a id="species-map-button" class="control-item icon icon-map">Distribution</a>
</div>

<ul id="species-info" class="table-view">
  <li>
    <div class="common-name"><%= obj.common_name %> <%= obj.common_name_significant %></div>
    <div class="taxon"><%= obj.taxon %></div>
  </li>
  <li id="species-map" style="display: none">
    <div id="maps-holder" style="display:none"></div>
    <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      <use id="species-map-data" xlink:href="#data"/>
      <use id="species-map-boundary" xlink:href="#boundary"/>
      <g id="legend">
        <text dy="15" x="30" y="0" style="font-size: normal">Main area</text>
        <rect width="20" height="20" fill="rgb(22.745098%,53.333333%,16.078431%)" y="0" x="0"></rect>
        <text dy="15" x="30" y="30" style="font-size: normal">Individual records</text>
        <rect width="20" height="20" fill="rgb(80.392157%,58.431373%,4.705882%)" y="30" x="0"></rect>
      </g>
    </svg>
  </li>
  <li>
    <p><%= obj.description %></p>
  </li>
  <li>
    <p><strong>Flowering period:</strong> <span><%= obj.flowering_period %></span></p>
    <p><strong>Germination period:</strong> <span><%= obj.germination_period %></span></p>
    <p><strong>Seed longevity:</strong> <span><%= obj.seed_longevity %></span></p>
    <p><strong>Conservation status:</strong> <span><%= obj.conservation_status %></span></p>
  </li>
  <li>
    <p><strong>Occurrence in conservation habitats:</strong></p>
    <p><%= obj.management %></p>
  </li>
  <li class="table-view-cell">
    <a href="#info/management/management" class="navigate-right btn-small">
      <span class="media-object pull-left icon icon-list-bullet"></span>
      More About Conservation
    </a>
  </li>
  <li class="table-view-cell">
    <a id="record-btn" class="navigate-right btn-small">
      <span class="media-object pull-left icon icon-plus"></span>
      Record Species
    </a>
  </li>
  <li class="table-view-cell">
    <a href="https://en.wikipedia.org/wiki/Glossary_of_botanical_terms" target="_blank" class="navigate-right btn-small">
      <span class="media-object pull-left icon icon-info"></span>
      Terms Glossary
    </a>
  </li>
</ul>
