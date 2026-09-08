(function () {
  "use strict";

  function addCartFooterStyles() {
    if (document.getElementById("cart-drawer-footer-styles")) return;

    var style = document.createElement("style");
    style.id = "cart-drawer-footer-styles";
    style.textContent = `
      .cart-drawer-footer {
        padding: 20px 20px 40px;
        display: block;
        position: sticky;
        bottom: 0;
        border-top: 1px solid #e5e5e5;
        background: #fff;
      }

      .cart-drawer-footer .cart-drawer-sub-total-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0;
        border-top: none;
        background-color: white;
      }

      .cart-drawer-footer .cart-drawer-total-price-note {
        padding: 0;
        font-size: 14px;
        font-family: "futura", "Jost", sans-serif;
        color: rgba(0, 0, 0, 0.5);
        background-color: white;
        margin-bottom: 10px;
      }

      .cart-drawer-footer .cart-drawer-checkout-btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 0;
        background-color: white;
      }
    `;

    document.head.appendChild(style);
  }

  function wrapCartFooter() {
    addCartFooterStyles();

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
