module.exports = UpdateSupplierTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="supplier-information">

    <div class="loading">

      Please wait while we prepare your data-entry form...

      <p></p>

      This page should load in approximately 10 seconds.

    </div>

    <div class="portal" style="display:none">

      <h3>Your Supplier Profile:</h3>

      Please ensure your company name and contact information is correct. If you are creating a new account we will contact you by email, phone or wechat shortly to confirm your information and assist with the certification process.

      <p></p>

      <div id="supplier-grid" class="supplier-grid grid-2"></div>

      <div id="${data.supplier_id}" class="update-supplier-btn button">Update Account</div>

    </div>
  </div>


  `;

  return html;

}
