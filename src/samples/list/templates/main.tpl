<% if (obj.useTraining) { %>
<div class="main-header training">training mode</div>
<% } %>
<% if (!obj.loggedIn) { %>
  <div id="login-warning" class="warning-message">Looks like you have not signed
    in to your iRecord account yet. Please do so, if you wish to have full access
    to your submitted records on iRecord.
    <a href='#user/login' class="btn btn-narrow btn-block">Sign in</a>
  </div>
<% } %>
<div class="info-message">
  <p>
    Saved recordings.
  </p>
</div>
<ul id="samples-list" class="table-view no-top"></ul>