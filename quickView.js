function QuickView(options = {}) {
  this.makeQuickViewButton = function (href) {
    const quickViewBtn = document.createElement("button");
    quickViewBtn.classList.add("qv-quick-view-btn");
    quickViewBtn.setAttribute("data-product-url", href);
    quickViewBtn.type = "button";
    quickViewBtn.textContent = "Quick View";
    return quickViewBtn;
  };
  this.addButtonToProductCards = function () {
    jQuery("article.product-card").each((i, e) => {
      const href = jQuery(e).find(".link-wrapper").attr("href");
      jQuery(e).append(this.makeQuickViewButton(href));
    });
  };
  this.addOnClickEventListenersOnQuickViewButtons = function () {
    jQuery(".qv-quick-view-btn").on("click", (e) =>
      this.handleQuickViewBtnClick(e)
    );
  };

  this.closeQuickViewPopup = function () {
    this.quickViewPopup.addClass("qv-popup-closed");
    jQuery(".qv-product-imgs").html("");
  };
  this.openQuickViewPopup = function () {
    this.quickViewPopup.removeClass("qv-popup-closed");
  };
  this.addEventListenerOnBackdropClicked = function () {
    jQuery(".qv-quick-view-backdrop").on("click", (e) =>
      this.closeQuickViewPopup()
    );
  };
  this.appendProductImgs = function (images) {
    jQuery(".qv-product-imgs").html('<div class="owl-carousel"></div>');
    const imageContainer = jQuery(".qv-product-imgs .owl-carousel");
    images.forEach((e) => {
      imageContainer.append(`<img class="qv-product-img" src="${e}">`);
    });
    imageContainer.owlCarousel();
  };
  this.getProductImgs = function (productUrl) {
    jQuery.ajax({
      url: productUrl,
      type: "GET",
      dataType: "html",
      cache: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "XMLHttpRequest",
      },
      success: (res) => {
        const div = document.createElement("div");
        div.style.position = "fixed !important";
        div.style.height = "0px !important";
        div.style.width = "0px !important";
        div.id = "tempDiv";
        div.innerHTML = res;
        document.body.appendChild(div);
        const imagesUrls = [];
        jQuery("#tempDiv")
          .find(".main-content .images .item")
          .each((i, e) => {
            const src = jQuery(e).attr("data-gallery");
            imagesUrls.push(src);
          });
        this.appendProductImgs(imagesUrls);
        div.remove();
      },
      error: (e) => {
        console.assert("fails");
      },
    });
  };
  this.handleQuickViewPopupCloseButtonOnClick = function (e) {
    jQuery(".qv-quick-view-popup .qv-close-btn").on("click", (e) =>
      this.closeQuickViewPopup()
    );
  };
  this.handleQuickViewBtnClick = function (e) {
    this.openQuickViewPopup();
    const url = jQuery(e.target).attr("data-product-url");
    this.getProductImgs(url);
  };

  this.render = function () {
    this.quickViewPopup = jQuery(".qv-quick-view-popup");
    this.addButtonToProductCards();
    this.handleQuickViewPopupCloseButtonOnClick();
    this.addEventListenerOnBackdropClicked();
    this.addOnClickEventListenersOnQuickViewButtons();
  };
}
jQuery(document).ready(function ($) {
  $(function () {
    const quickView = new QuickView();
    quickView.render();
  });
});
