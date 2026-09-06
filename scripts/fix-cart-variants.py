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

path.write_text(text, encoding="utf-8")
print("Cart numeric sizes and out-of-stock size handling updated.")
