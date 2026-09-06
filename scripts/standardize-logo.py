from pathlib import Path
import re

HEADER = '''<div class="top-head-logo-box">
  <a href="index.html" class="mavie-logo-link" aria-label="Mavie Jewelry home">
    <img src="Images/mavie-logo.png" alt="Mavie Jewelry" class="mavie-logo-image">
  </a>
</div>'''

FOOTER = '''<div class="mavie-footer-logo-box">
  <a href="index.html" class="mavie-logo-footer-link">
    <img src="Images/mavie-logo.png" alt="Mavie Jewelry" class="mavie-logo-image">
  </a>
</div>'''

HEADER_BOX = re.compile(
    r'<div\b[^>]*class=["\'][^"\']*\btop-head-logo-box\b[^"\']*["\'][^>]*>[\s\S]*?</div>',
    re.IGNORECASE,
)

FOOTER_BOX = re.compile(
    r'<div\b[^>]*class=["\'][^"\']*\bmavie-footer-logo-box\b[^"\']*["\'][^>]*>[\s\S]*?</div>',
    re.IGNORECASE,
)

LOGO_CSS = '''

/* MAVIE GLOBAL LOGO STYLES */
.mavie-logo-link {
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mavie-logo-link img {
  width: 100%;
  height: auto;
}

@media screen and (max-width: 768px) {
  .mavie-logo-link {
    width: 110px;
  }
}

.mavie-logo-footer-link {
  width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mavie-logo-footer-link img {
  width: 100%;
  height: auto;
}
/* MAVIE GLOBAL LOGO STYLES END */
'''

for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    original = text
    text = HEADER_BOX.sub(HEADER, text)
    text = FOOTER_BOX.sub(FOOTER, text)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated markup: {path}')

for path in Path('.').glob('*.css'):
    text = path.read_text(encoding='utf-8')
    if '/* MAVIE GLOBAL LOGO STYLES */' not in text:
        path.write_text(text.rstrip() + LOGO_CSS, encoding='utf-8')
        print(f'Added logo CSS: {path}')
