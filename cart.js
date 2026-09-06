(function () {
  "use strict";

  var STORAGE_KEY = "mavieCart";
  var COLLECTION_URL = "product-collection.html";
  var JEWELRY_SIZES = ["5", "5.5", "6", "6.5", "7", "7.5"];

  var seedCart = [
    { id: "demo-ring-gold-silver", name: "Ring", price: 99, image: "Images/rings-image-1.jpg", color: "Gold/Silver", size: "5.5", quantity: 1 },
    { id: "demo-earring-silver", name: "Earring", price: 78, image: "Images/earing-item.jpg", color: "Silver", size: "", quantity: 1 }
  ];

  var boughtTogetherProducts = [
    { id: "bought-ring", name: "Rings", price: 99, goldImage: "Images/rings-image-1.jpg", silverImage: "Images/rings-image-2.jpg", color: "Gold", size: "5.5" },
    { id: "bought-necklace", name: "Necklace", price: 89, goldImage: "Images/necklace-banner-1.jpg", silverImage: "Images/necklace-banner-2.jpg", color: "Silver", size: "" }
  ];

  function supportsSize(name) {
    var normalizedName = String(name || "").toLowerCase();
    return normalizedName.indexOf("ring") !== -1 || normalizedName.indexOf("bracelet") !== -1;
  }

  function normalizeCartItem(item) {
    var normalized = Object.assign({}, item);
    if (supportsSize(normalized.name)) {
      normalized.size = JEWELRY_SIZES.indexOf(String(normalized.size || "")) !== -1 ? String(normalized.size) : "5.5";
    } else {
      normalized.size = "";
    }
    return normalized;
  }

  function readCart() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.map(normalizeCartItem);
      }
    } catch (error) {
      console.warn("Mavie cart could not be read.", error);
    }
    return seedCart.map(function (item) { return normalizeCartItem(item); });
  }

  function saveCart(cart) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
    catch (error) { console.warn("Mavie cart could not be saved.", error); }
  }

  var cart = readCart();

  function money(value) {
    return "$" + Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function getCartDrawer() {
    var drawer = document.querySelector(".cart-drawer-main-container");
    if (!drawer) {
      drawer = document.createElement("div");
      drawer.className = "cart-drawer-main-container";
      drawer.innerHTML = '<div class="cart-drawer-inner-container"><div class="cart-drawer-blank-space"></div><div class="cart-drawer-main-box"></div></div>';
      document.body.appendChild(drawer);
    }
    return drawer;
  }

  function updateCartCount() {
    var total = cart.reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0);
    document.querySelectorAll(".cart-count-box p").forEach(function (element) { element.textContent = String(total).padStart(2, "0"); });
    document.querySelectorAll(".cart-drawer-item-text").forEach(function (element) { element.textContent = total + (total === 1 ? " item" : " items"); });
  }

  function getSubtotal() {
    return cart.reduce(function (sum, item) { return sum + Number(item.price || 0) * Number(item.quantity || 0); }, 0);
  }

  function renderHeader(total) {
    return '<div class="cart-drawer-heading-box"><div class="cart-drawer-heading"><a href="my-cart.html">your cart</a></div><div class="cart-drawer-close-box"><div class="cart-drawer-item-text">' + total + (total === 1 ? " item" : " items") + '</div><div class="cart-drawer-cross-icon-box" role="button" tabindex="0" aria-label="Close cart"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12" fill="none"><path d="M1.58008 10.4186L10.4201 1.58105M1.58008 1.58105L10.4201 10.4186M1.58008 1.58105L10.4201 10.4186" stroke="black" stroke-width="0.8" stroke-linecap="butt"></path></svg></div></div></div>';
  }

  function renderEmptyState() {
    return renderHeader(0) + '<div class="mavie-empty-cart-state"><div class="mavie-empty-cart-title">Your cart Is empty</div><a class="mavie-empty-cart-button" href="' + COLLECTION_URL + '">Continue shopping</a></div>';
  }

  function renderItem(item, index) {
    var size = supportsSize(item.name) && item.size ? '<div class="mavie-cart-meta">Size: ' + escapeHtml(item.size) + '</div>' : '';
    return '<div class="cart-drawer-item-box mavie-cart-item" data-index="' + index + '"><a class="cart-drawer-item-img-box" href="product-page.html"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" class="cart-drawer-item-img"></a><div class="cart-drawer-item-info"><div class="cart-drawer-item-name">' + escapeHtml(item.name) + '</div><div class="cart-drawer-item-color">' + escapeHtml(item.color || "") + '</div>' + size + '<div class="cart-drawer-item-quantity-box"><select class="mavie-cart-quantity" aria-label="Quantity">' + [1,2,3,4,5,6,7,8,9,10].map(function (quantity) { return '<option value="' + quantity + '"' + (Number(item.quantity) === quantity ? ' selected' : '') + '>' + quantity + '</option>'; }).join("") + '</select></div></div><div class="cart-drawer-item-price">' + money(Number(item.price) * Number(item.quantity)) + '</div><button type="button" class="cart-drawer-remove-item mavie-cart-remove">remove</button></div>';
  }

  function renderBoughtTogether() {
    if (!boughtTogetherProducts.length) return "";
    return '<div class="cart-drawer-bought-together-heading">bought together</div>' + boughtTogetherProducts.map(function (product) {
      var image = product.color.toLowerCase() === "silver" ? product.silverImage : product.goldImage;
      var sizeSelector = supportsSize(product.name) ? '<div class="cart-drawer-item-size-box"><select class="mavie-bought-size" aria-label="Size">' + JEWELRY_SIZES.map(function (size) { return '<option value="' + size + '"' + (size === product.size ? ' selected' : '') + '>' + size + '</option>'; }).join("") + '</select></div>' : '';
      return '<div class="cart-drawer-item-box mavie-bought-item" data-bought-id="' + escapeHtml(product.id) + '"><div class="cart-drawer-item-img-box"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(product.name) + '" class="cart-drawer-item-img mavie-bought-image"></div><div class="cart-drawer-item-info"><div class="cart-drawer-item-name">' + escapeHtml(product.name) + '</div><div class="cart-drawer-item-color-box"><div class="cart-drawer-item-gold ' + (product.color === "Gold" ? "gold-active" : "") + ' mavie-bought-gold" role="button" tabindex="0"><div class="item-gold"></div></div><div class="cart-drawer-item-silver ' + (product.color === "Silver" ? "silver-active" : "") + ' mavie-bought-silver" role="button" tabindex="0"><div class="item-silver"></div></div></div>' + sizeSelector + '</div><div class="cart-drawer-item-price">' + money(product.price) + '</div><button type="button" class="cart-drawer-add-cart-btn mavie-bought-add">add to cart</button></div>';
    }).join("");
  }

  function renderCart() {
    var drawer = getCartDrawer();
    var mainBox = drawer.querySelector(".cart-drawer-main-box");
    if (!mainBox) return;
    var total = cart.reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0);
    if (!cart.length) {
      mainBox.innerHTML = renderEmptyState();
      updateCartCount();
      return;
    }
    mainBox.innerHTML = renderHeader(total) + cart.map(renderItem).join("") + renderBoughtTogether() + '<div class="cart-drawer-sub-total-box"><div class="subtotal-text">subtotal</div><div class="subtotal-price">' + money(getSubtotal()) + '</div></div><div class="cart-drawer-total-price-note">Tax included and shipping calculated at checkout</div><div class="cart-drawer-checkout-btn-box"><button type="button" class="cart-drawer-checkout-btn">checkout</button></div>';
    updateCartCount();
  }

  function openCart() {
    var drawer = getCartDrawer();
    drawer.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    var drawer = getCartDrawer();
    drawer.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function addToCart(item) {
    var normalized = normalizeCartItem(Object.assign({ quantity: 1 }, item));
    normalized.quantity = Math.max(1, Number(normalized.quantity || 1));
    var existing = cart.find(function (cartItem) {
      return cartItem.id === normalized.id && String(cartItem.color || "").toLowerCase() === String(normalized.color || "").toLowerCase() && String(cartItem.size || "").toLowerCase() === String(normalized.size || "").toLowerCase();
    });
    if (existing) existing.quantity = Math.min(10, Number(existing.quantity || 0) + normalized.quantity);
    else cart.push(normalized);
    saveCart(cart);
    renderCart();
    openCart();
  }

  function getProductPageItem() {
    var nameElement = document.querySelector(".mavie-product-name");
    var priceElement = document.querySelector(".mavie-product-price");
    var imageElement = document.querySelector(".mavie-product-img");
    var colorElement = document.querySelector(".mavie-product-color-text-box span");
    var sizeElement = document.querySelector(".size-box.select-size-active");
    var quantityElement = document.querySelector(".mavie-product-quantity-selection-box");
    var name = nameElement ? nameElement.textContent.trim() : "Product";
    var priceText = priceElement ? priceElement.textContent.replace(/[^0-9.]/g, "") : "0";
    var price = parseFloat(priceText) || 0;
    var image = imageElement ? imageElement.getAttribute("src") : "Images/mavie-missing-product.svg";
    var color = colorElement ? colorElement.textContent.trim() : "Silver";
    var size = supportsSize(name) && sizeElement ? sizeElement.textContent.replace(/[^0-9.]/g, "").trim() : "";
    var quantity = quantityElement ? parseInt(quantityElement.options[quantityElement.selectedIndex].textContent, 10) : 1;
    return { id: "product-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + color.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + size, name: name, price: price, image: image, color: color, size: size, quantity: quantity || 1 };
  }

  function injectStyles() {
    if (document.getElementById("mavie-cart-styles")) return;
    var style = document.createElement("style");
    style.id = "mavie-cart-styles";
    style.textContent = `.mavie-empty-cart-state{min-height:420px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;padding:40px 20px;text-align:center}.mavie-empty-cart-title{font-family:"futura","Jost",sans-serif;font-size:22px;text-transform:none}.mavie-empty-cart-button{min-width:190px;height:45px;padding:0 24px;display:inline-flex;justify-content:center;align-items:center;background:#000;color:#fff;text-decoration:none;font-family:"futura","Jost",sans-serif;font-size:13px;text-transform:capitalize;border-radius:4px}.mavie-cart-meta{font-family:"futura","Jost",sans-serif;font-size:12px;opacity:.5;margin:-5px 0 8px}.cart-drawer-main-container{z-index:9999!important}.cart-drawer-main-box{overflow-y:auto}.cart-drawer-checkout-btn{cursor:pointer}.mavie-bought-item .cart-drawer-item-img-box{overflow:hidden}.mavie-bought-item .cart-drawer-item-img{object-fit:cover}@media screen and (max-width:768px){.cart-drawer-main-box,.cart-drawer-heading-box{width:100%}.cart-drawer-main-box{max-width:430px}}`;
    document.head.appendChild(style);
  }

  function setupEvents() {
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (target.closest(".desk-cart, .mob-cart, .cart")) { event.preventDefault(); renderCart(); openCart(); return; }
      if (target.closest(".cart-drawer-cross-icon-box, .cart-drawer-blank-space")) { event.preventDefault(); closeCart(); return; }
      var removeButton = target.closest(".mavie-cart-remove");
      if (removeButton) {
        var itemBox = removeButton.closest(".mavie-cart-item");
        var index = itemBox ? Number(itemBox.getAttribute("data-index")) : -1;
        if (index >= 0) { cart.splice(index, 1); saveCart(cart); renderCart(); }
        return;
      }
      var addButton = target.closest(".mavie-product-add-cart-btn");
      if (addButton) { event.preventDefault(); addToCart(getProductPageItem()); return; }
      var boughtAddButton = target.closest(".mavie-bought-add");
      if (boughtAddButton) {
        event.preventDefault();
        var boughtBox = boughtAddButton.closest(".mavie-bought-item");
        var boughtId = boughtBox ? boughtBox.getAttribute("data-bought-id") : "";
        var product = boughtTogetherProducts.find(function (item) { return item.id === boughtId; });
        if (product) {
          var color = boughtBox.querySelector(".gold-active") ? "Gold" : "Silver";
          var sizeSelect = boughtBox.querySelector(".mavie-bought-size");
          var size = sizeSelect ? sizeSelect.value : "";
          var image = color === "Gold" ? product.goldImage : product.silverImage;
          addToCart({ id: product.id, name: product.name, price: product.price, image: image, color: color, size: size, quantity: 1 });
        }
        return;
      }
      var goldButton = target.closest(".mavie-bought-gold");
      var silverButton = target.closest(".mavie-bought-silver");
      if (goldButton || silverButton) {
        var variantBox = (goldButton || silverButton).closest(".mavie-bought-item");
        var variantId = variantBox ? variantBox.getAttribute("data-bought-id") : "";
        var variant = boughtTogetherProducts.find(function (item) { return item.id === variantId; });
        if (variant && variantBox) {
          var imageElement = variantBox.querySelector(".mavie-bought-image");
          if (goldButton) { goldButton.classList.add("gold-active"); silverButton.classList.remove("silver-active"); if (imageElement) imageElement.src = variant.goldImage; }
          else { silverButton.classList.add("silver-active"); goldButton.classList.remove("gold-active"); if (imageElement) imageElement.src = variant.silverImage; }
        }
      }
    });

    document.addEventListener("change", function (event) {
      if (!event.target.matches(".mavie-cart-quantity")) return;
      var itemBox = event.target.closest(".mavie-cart-item");
      var index = itemBox ? Number(itemBox.getAttribute("data-index")) : -1;
      if (index < 0 || !cart[index]) return;
      cart[index].quantity = Math.max(1, Math.min(10, Number(event.target.value) || 1));
      saveCart(cart);
      renderCart();
    });
  }

  function init() {
    injectStyles();
    getCartDrawer();
    renderCart();
    setupEvents();
    saveCart(cart);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();