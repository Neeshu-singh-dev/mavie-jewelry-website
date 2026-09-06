(function () {
  "use strict";

  function wrapCartFooter() {
    var drawer = document.querySelector(".cart-drawer-main-box");
    if (!drawer) return;

    var subtotal = drawer.querySelector(".cart-drawer-sub-total-box");
    var note = drawer.querySelector(".cart-drawer-total-price-note");
    var checkout = drawer.querySelector(".cart-drawer-checkout-btn-box");

    if (!subtotal || !note || !checkout) return;

    var existingFooter = drawer.querySelector(":scope > .cart-drawer-footer");
    if (existingFooter) return;

    var footer = document.createElement("div");
    footer.className = "cart-drawer-footer";

    subtotal.parentNode.insertBefore(footer, subtotal);
    footer.appendChild(subtotal);
    footer.appendChild(note);
    footer.appendChild(checkout);
  }

  function observeCartDrawer() {
    wrapCartFooter();

    var observer = new MutationObserver(function () {
      wrapCartFooter();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeCartDrawer);
  } else {
    observeCartDrawer();
  }
})();
