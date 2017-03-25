<div class="info-message">
  <p>How many individuals of this type?</p>
</div>
<div class="list">
  <label class="item item-radio">
    <input type="radio" name="group" value="default"
    <%- !_.keys(obj).length || obj['Present'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Present
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="1" <%- obj['1'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        1
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="2-5" <%- obj['2-5'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        2-5
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="6-20" <%- obj['6-20'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        6-20
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="21-100" <%- obj['21-100'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        21-100
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="101-500" <%- obj['101-500'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        101-500
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="500+" <%- obj['500+'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        500+
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

</div>
