from pathlib import Path

path = Path("cart.js")
text = path.read_text(encoding="utf-8")

# Match the numeric sizing used by the product page.
text = text.replace(
    'var JEWELRY_SIZES = ["5", "5.5", "6", "6.5", "7", "7.5"];',
    'var JEWELRY_SIZES = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5"];\n  var OUT_OF_STOCK_SIZES = ["7"];'
)

# Keep all numeric sizes available in the cart, but mark the known unavailable size.
old = '''var sizeSelector = supportsSize(product.name) ? '<div class="cart-drawer-item-size-box"><select class="mavie-bought-size" aria-label="Size">' + JEWELRY_SIZES.map(function (size) { return '<option value="' + size + '"' + (size === product.size ? ' selected' : '') + '>' + size + '</option>'; }).join("") + '</select></div>' : '';'''
new = '''var sizeSelector = supportsSize(product.name) ? '<div class="cart-drawer-item-size-box"><select class="mavie-bought-size" aria-label="Size">' + JEWELRY_SIZES.map(function (size) { var unavailable = OUT_OF_STOCK_SIZES.indexOf(size) !== -1; return '<option value="' + size + '"' + (size === product.size ? ' selected' : '') + (unavailable ? ' disabled' : '') + '>' + size + (unavailable ? ' - Out of stock' : '') + '</option>'; }).join("") + '</select></div>' : '';'''
if old in text:
    text = text.replace(old, new)
else:
    raise SystemExit("Expected bought-together size selector was not found")

# Do not allow an unavailable numeric size to be added from Bought Together.
old_add = '''var size = sizeSelect ? sizeSelect.value : "";\n          var image = color === "Gold" ? product.goldImage : product.silverImage;\n          addToCart({ id: product.id, name: product.name, price: product.price, image: image, color: color, size: size, quantity: 1 });'''
new_add = '''var size = sizeSelect ? sizeSelect.value : "";\n          if (supportsSize(product.name) && OUT_OF_STOCK_SIZES.indexOf(size) !== -1) { return; }\n          var image = color === "Gold" ? product.goldImage : product.silverImage;\n          addToCart({ id: product.id, name: product.name, price: product.price, image: image, color: color, size: size, quantity: 1 });'''
if old_add in text:
    text = text.replace(old_add, new_add)
else:
    raise SystemExit("Expected Bought Together add-to-cart block was not found")

# Do not allow an unavailable ring/bracelet size from the product page into the cart.
old_add_to_cart = '''var normalized = normalizeCartItem(Object.assign({ quantity: 1 }, item));\n    normalized.quantity = Math.max(1, Number(normalized.quantity || 1));'''
new_add_to_cart = '''var normalized = normalizeCartItem(Object.assign({ quantity: 1 }, item));\n    if (supportsSize(normalized.name) && OUT_OF_STOCK_SIZES.indexOf(String(normalized.size || "")) !== -1) { return; }\n    normalized.quantity = Math.max(1, Number(normalized.quantity || 1));'''
if old_add_to_cart in text:
    text = text.replace(old_add_to_cart, new_add_to_cart)
else:
    raise SystemExit("Expected addToCart normalization block was not found")

# Keep subtotal, tax/shipping note, and checkout controls together under one footer parent.
old_footer = '''renderBoughtTogether() + '<div class="cart-drawer-sub-total-box"><div class="subtotal-text">subtotal</div><div class="subtotal-price">' + money(getSubtotal()) + '</div></div><div class="cart-drawer-total-price-note">Tax included and shipping calculated at checkout</div><div class="cart-drawer-checkout-btn-box"><button type="button" class="cart-drawer-checkout-btn">checkout</button></div>';'''
new_footer = '''renderBoughtTogether() + '<div class="cart-drawer-footer"><div class="cart-drawer-sub-total-box"><div class="subtotal-text">subtotal</div><div class="subtotal-price">' + money(getSubtotal()) + '</div></div><div class="cart-drawer-total-price-note">Tax included and shipping calculated at checkout</div><div class="cart-drawer-checkout-btn-box"><button type="button" class="cart-drawer-checkout-btn">checkout</button></div></div>';'''
if old_footer in text:
    text = text.replace(old_footer, new_footer)
else:
    raise SystemExit("Expected cart drawer footer markup was not found")

path.write_text(text, encoding="utf-8")
print("Cart numeric sizes, out-of-stock handling, and footer wrapper updated.")
