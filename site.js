(function () {
  "use strict";

  var productCardSelectors = [
    ".product-collection-item-box",
    ".pointer-product-box",
    ".shop-the-look-product-box",
    ".product-featured-banner-product-image-box",
    ".recent-view-image-box",
    ".collection-product"
  ];
  var selector = productCardSelectors.join(",");
  var productPage = "product-page.html";

  function isInteractiveTarget(target) {
    return !!target.closest("a, button, input, select, textarea, label, [role='button']");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(selector).forEach(function (card) {
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.style.cursor = "pointer";
    });
  });

  document.addEventListener("click", function (event) {
    var card = event.target.closest(selector);
    if (!card || isInteractiveTarget(event.target)) return;
    window.location.href = productPage;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var card = event.target.closest(selector);
    if (!card || isInteractiveTarget(event.target)) return;
    event.preventDefault();
    window.location.href = productPage;
  });
})();
