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
.top-head-logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 180px;
}

.mavie-logo-link {
  width: 180px !important;
  max-width: 180px !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  flex: 0 0 180px;
}

.mavie-logo-link img,
.top-head-logo-box .mavie-logo-image {
  display: block !important;
  width: 180px !important;
  max-width: 180px !important;
  height: auto !important;
}

.mavie-footer-logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mavie-logo-footer-link {
  width: 140px !important;
  max-width: 140px !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  flex: 0 0 140px;
}

.mavie-logo-footer-link img,
.mavie-footer-logo-box .mavie-logo-image {
  display: block !important;
  width: 140px !important;
  max-width: 140px !important;
  height: auto !important;
}

@media screen and (max-width: 768px) {
  .top-head-logo-box {
    flex-basis: 110px;
  }

  .mavie-logo-link {
    width: 110px !important;
    max-width: 110px !important;
    flex-basis: 110px;
  }

  .mavie-logo-link img,
  .top-head-logo-box .mavie-logo-image {
    width: 110px !important;
    max-width: 110px !important;
  }
}
/* MAVIE GLOBAL LOGO STYLES END */
'''

# Keep every HTML page on the same logo markup.
for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    original = text
    text = HEADER_BOX.sub(HEADER, text)
    text = FOOTER_BOX.sub(FOOTER, text)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated markup: {path}')

# Create one authoritative stylesheet so it always loads after page-specific CSS.
logo_css_path = Path('logo.css')
logo_css_path.write_text(LOGO_CSS.strip() + '\n', encoding='utf-8')

logo_link = '<link rel="stylesheet" href="logo.css">'
for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    if logo_link not in text:
        text = re.sub(r'\s*</head>', f'\n    {logo_link}\n</head>', text, count=1, flags=re.IGNORECASE)
        path.write_text(text, encoding='utf-8')
        print(f'Added logo.css link: {path}')
