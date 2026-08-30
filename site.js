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

  function injectMavieFixStyles() {
    if (document.getElementById("mavie-fix-styles")) return;

    var style = document.createElement("style");
    style.id = "mavie-fix-styles";
    style.textContent = `
      /* ABOUT US LOCAL MENU BAR */
      .about-us-menu-bar-inner-container {
        width: min(1000px, 100%);
        justify-content: center;
      }

      /* DESKTOP MEGA-MENU OVERLAY */
      .mavie-mega-menu-overlay {
        position: fixed;
        inset: 0;
        z-index: 90;
        background: rgba(0, 0, 0, 0.28);
        display: none;
        cursor: default;
      }

      .jewel-menu-main-container,
      .collection-menu-main-container,
      .top-about-menu-main-container {
        position: relative;
        z-index: 99;
      }

      /* PRODUCT PAGE */
      .mavie-product-description {
        margin: 10px 0 22px;
        max-width: 620px;
        font-family: "futura", "Jost", sans-serif;
        font-size: 14px;
        line-height: 1.55;
        color: rgba(0, 0, 0, 0.68);
      }

      .mavie-product-circal {
        width: 24px !important;
        height: 24px !important;
        min-width: 24px;
        min-height: 24px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .mavie-product-circal .mavie-product-inner-circal {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: block;
      }

      .mavie-selected-color {
        border: 1px solid #D5BF87;
      }

      .mavie-product-circal:not(.mavie-selected-color) {
        border: 1px solid #D9D9D9;
      }

      .mavie-product-delivery-note-box {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mavie-product-delivery-note-box .mavie-delivery-icon {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .mavie-product-delivery-note-box .mavie-delivery-icon img {
        width: 20px;
        height: 20px;
        display: block;
        object-fit: contain;
      }

      .product-size-slider {
        overflow: hidden;
      }

      .also-like-main-box .also-like-image-inner-box {
        background: #f7f5f1;
        aspect-ratio: 1 / 1;
        overflow: hidden;
      }

      .also-like-main-box .also-like-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .also-like-main-box .product-color-box {
        min-height: 42px;
        align-items: center;
      }

      @media screen and (max-width: 768px) {
        .about-us-menu-bar-inner-container {
          width: 100%;
          min-width: 680px;
        }

        .mavie-product-description {
          font-size: 13px;
          margin-bottom: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function closeMegaMenus() {
    if (!window.jQuery) return;
    var $ = window.jQuery;
    $(".jewel-menu-main-container, .collection-menu-main-container, .top-about-menu-main-container")
      .stop(true, true)
      .fadeOut(140);
    $(".mavie-mega-menu-overlay").stop(true, true).fadeOut(140);
  }

  function openMegaMenu(selectorToOpen) {
    if (!window.jQuery) return;
    var $ = window.jQuery;
    var $menus = $(".jewel-menu-main-container, .collection-menu-main-container, .top-about-menu-main-container");
    var $target = $(selectorToOpen);

    $menus.not($target).stop(true, true).hide();
    $target.stop(true, true).fadeIn(180);
    $(".mavie-mega-menu-overlay").stop(true, true).fadeIn(180);
  }

  function setupMegaMenus() {
    if (!window.jQuery) return;

    var $ = window.jQuery;
    var $document = $(document);
    var megaMenuSelectors = ".jewel-menu-main-container, .collection-menu-main-container, .top-about-menu-main-container";

    if (!$(".jewel-option, .collection-menu, .about-menu").length) return;

    if (!$(".mavie-mega-menu-overlay").length) {
      $("<div class='mavie-mega-menu-overlay' aria-hidden='true'></div>").appendTo("body");
    }

    /* Remove the old mouseover/fadeToggle handlers from page-level scripts. */
    $document.off("mouseover", ".jewel-option");
    $document.off("mouseover", ".collection-menu");
    $document.off("mouseover", ".about-menu");

    $document.off("mouseenter.mavieMega", ".jewel-option");
    $document.off("mouseenter.mavieMega", ".collection-menu");
    $document.off("mouseenter.mavieMega", ".about-menu");
    $document.off("mouseleave.mavieMega", megaMenuSelectors);
    $document.off("mouseenter.mavieMega", megaMenuSelectors);
    $document.off("mouseenter.mavieMega", ".mavie-mega-menu-overlay");
    $document.off("click.mavieMega", ".mavie-mega-menu-overlay");

    $document.on("mouseenter.mavieMega", ".jewel-option", function () {
      openMegaMenu(".jewel-menu-main-container");
    });

    $document.on("mouseenter.mavieMega", ".collection-menu", function () {
      openMegaMenu(".collection-menu-main-container");
    });

    $document.on("mouseenter.mavieMega", ".about-menu", function () {
      openMegaMenu(".top-about-menu-main-container");
    });

    $document.on("mouseenter.mavieMega", megaMenuSelectors, function () {
      $(this).stop(true, true).show();
      $(".mavie-mega-menu-overlay").stop(true, true).show();
    });

    $document.on("mouseleave.mavieMega", megaMenuSelectors, function (event) {
      var related = event.relatedTarget;
      var menuSelector = ".jewel-menu-main-container, .collection-menu-main-container, .top-about-menu-main-container";
      var triggerSelector = ".jewel-option, .collection-menu, .about-menu";

      if (related && (related.closest && (related.closest(menuSelector) || related.closest(triggerSelector)))) {
        return;
      }

      closeMegaMenus();
    });

    $document.on("mouseenter.mavieMega", ".mavie-mega-menu-overlay", function () {
      closeMegaMenus();
    });

    $document.on("click.mavieMega", ".mavie-mega-menu-overlay", function () {
      closeMegaMenus();
    });

    $(window).off("scroll.mavieMega").on("scroll.mavieMega", function () {
      closeMegaMenus();
    });
  }

  function setupProductPagePolish() {
    if (!window.jQuery || !document.querySelector(".mavie-produt-main-container")) return;

    var $ = window.jQuery;
    var productName = document.querySelector(".mavie-product-name");

    if (productName && !document.querySelector(".mavie-product-description")) {
      var description = document.createElement("div");
      description.className = "mavie-product-description";
      description.textContent = "A refined pear-shaped ring designed with sustainably crafted lab-grown diamonds, balancing graceful proportions with a modern, versatile finish.";
      productName.insertAdjacentElement("afterend", description);
    }

    /* Replace the broken embedded delivery image with the repository SVG. */
    var deliveryNote = document.querySelector(".mavie-product-delivery-note-box");
    if (deliveryNote) {
      deliveryNote.innerHTML = "<span class='mavie-delivery-icon'><img src='Images/mavie-delivery.svg' alt='' aria-hidden='true'></span><span>Complementary Free Express Delivery</span>";
    }

    /* Keep only true item-style products in You May Also Like. */
    var relatedSlides = document.querySelectorAll(".also-like-slider .swiper-wrapper > .swiper-slide");
    var relatedProducts = [
      { image: "Images/necklace-image.jpg", title: "Necklace" },
      { image: "Images/rings-image-1.jpg", title: "Ring" },
      { image: "Images/bracelet-model.jpg", title: "Bracelet" },
      { image: "Images/earing-item-1.jpg", title: "Earrings" }
    ];

    Array.prototype.forEach.call(relatedSlides, function (slide, index) {
      if (index >= relatedProducts.length) {
        slide.style.display = "none";
        return;
      }

      var product = relatedProducts[index];
      var image = slide.querySelector(".also-like-img");
      var title = slide.querySelector(".also-like-text:not(.also-like-price)");
      var price = slide.querySelector(".also-like-price");

      if (image) {
        image.src = product.image;
        image.alt = product.title;
      }
      if (title) title.textContent = product.title;
      if (price) price.textContent = "Starts from - $12.00";
    });

    /* The existing Swiper uses 6.1 slides, which clips the last size box. */
    var sizeSliderElement = document.querySelector(".product-size-slider");
    if (sizeSliderElement && sizeSliderElement.swiper) {
      var sizeSwiper = sizeSliderElement.swiper;
      sizeSwiper.params.slidesPerView = window.innerWidth >= 769 ? 5.35 : 4.15;
      sizeSwiper.update();
    }

    /* Make the related-product variant pills behave like the product-card pills. */
    $(".also-like-main-box .golden-box, .also-like-main-box .silver-box")
      .attr("role", "button")
      .attr("tabindex", "0");

    $(document).off("click.mavieRelatedVariants", ".also-like-main-box .golden-box");
    $(document).off("click.mavieRelatedVariants", ".also-like-main-box .silver-box");

    $(document).on("click.mavieRelatedVariants", ".also-like-main-box .golden-box", function (event) {
      event.stopPropagation();
      $(this).addClass("golden-active").siblings(".silver-box").removeClass("silver-active");
    });

    $(document).on("click.mavieRelatedVariants", ".also-like-main-box .silver-box", function (event) {
      event.stopPropagation();
      $(this).addClass("silver-active").siblings(".golden-box").removeClass("golden-active");
    });

    $(window).off("resize.mavieProductPolish").on("resize.mavieProductPolish", function () {
      if (sizeSliderElement && sizeSliderElement.swiper) {
        sizeSliderElement.swiper.params.slidesPerView = window.innerWidth >= 769 ? 5.35 : 4.15;
        sizeSliderElement.swiper.update();
      }
    });
  }

  injectMavieFixStyles();
  setupQuickViewHover();

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(selector).forEach(function (card) {
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.style.cursor = "pointer";
    });

    injectMavieFixStyles();
    setupQuickViewHover();
    setupMegaMenus();
    setupProductPagePolish();
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