(function () {
  "use strict";

  var productCardSelectors = [
    ".product-collection-item-box",
    ".pointer-product-box",
    ".shop-the-look-product-box",
    ".product-featured-banner-product-image-box",
    ".recent-view-image-box",
    ".collection-product",
    ".shine-season-image-inner-box",
    ".latest-arrivals-image-inner-box",
    ".earrings-image-inner-box",
    ".product-collection-image-inner-box",
    ".ring-collection-image-inner-box",
    ".necklace-collection-image-inner-box",
    ".best-pair-image-inner-box",
    ".also-like-image-inner-box",
    ".may-like-image-inner-box",
    ".recent-view-image-inner-box"
  ];
  var selector = productCardSelectors.join(",");
  var productPage = "product-page.html";

  var quickViewPairs = [
    [".shine-season-img", ".shine-season-image-inner-box", ".shine-season-quick-view"],
    [".latest-arrivals-img", ".latest-arrivals-image-inner-box", ".latest-arrivals-quick-view"],
    [".earrings-img", ".earrings-image-inner-box", ".earrings-quick-view"],
    [".product-collection-img", ".product-collection-image-inner-box", ".product-collection-quick-view"],
    [".ring-collection-img", ".ring-collection-image-inner-box", ".ring-collection-quick-view"],
    [".necklace-collection-img", ".necklace-collection-image-inner-box", ".necklace-collection-quick-view"],
    [".best-pair-img", ".best-pair-image-inner-box", ".best-pair-quick-view"],
    [".also-like-img", ".also-like-image-inner-box", ".also-like-quick-view"],
    [".recent-view-img", ".recent-view-image-inner-box", ".recent-view-quick-view"],
    [".may-like-img", ".may-like-image-inner-box", ".may-like-quick-view"]
  ];

  function isInteractiveTarget(target) {
    return !!target.closest("a, button, input, select, textarea, label, [role='button']");
  }

  function setupQuickViewHover() {
    if (!window.jQuery) return;

    var $document = window.jQuery(document);

    quickViewPairs.forEach(function (pair) {
      var imageSelector = pair[0];
      var containerSelector = pair[1];
      var quickViewSelector = pair[2];

      // Remove the old image-only handlers so the quick-view panel cannot
      // trigger mouseenter/mouseleave repeatedly while it slides under the cursor.
      $document.off("mouseenter", imageSelector);
      $document.off("mouseleave", imageSelector);

      $document.off("mouseenter.mavieQuickView", containerSelector);
      $document.off("mouseleave.mavieQuickView", containerSelector);

      $document.on("mouseenter.mavieQuickView", containerSelector, function () {
        window.jQuery(quickViewSelector).stop(true, true).slideUp(180);
        window.jQuery(this).find(quickViewSelector).stop(true, true).slideDown(180);
      });

      $document.on("mouseleave.mavieQuickView", containerSelector, function () {
        window.jQuery(this).find(quickViewSelector).stop(true, true).slideUp(180);
      });
    });
  }

  // site.js is deferred, so the inline page scripts have already registered
  // their handlers. Replace them before the user can interact with the cards.
  setupQuickViewHover();

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(selector).forEach(function (card) {
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.style.cursor = "pointer";
    });

    setupQuickViewHover();
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
