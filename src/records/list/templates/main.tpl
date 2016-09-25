<% if (!obj.loggedIn) { %>
  <div id="login-warning" class="warning-message">Looks like you have not Signed
    in to your iRecord account yet. Please do so, if you wish to have a full access
    to your submitted records on iRecord.
    <a href='#user/login' class="btn btn-narrow btn-block">Sign in</a>
  </div>
<% } %>
<div class="info-message">
  <p>
    Saved recordings. <br/>
    <em style="font-weight: 300; display: inline;"> Full app statistics
      <a href="<%- obj.statistics_url %>" target="_blank" style="font-weight:bold;color: white;">here.</a></em>
  </p>
</div>
<ul id="records-list" class="table-view no-top"></ul>