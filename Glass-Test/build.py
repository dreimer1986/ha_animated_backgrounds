"""Build offline configurator files and the distributable HA module archive."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="configurator.css">', '<style>\n' + (root / 'configurator.css').read_text() + '\n</style>')
for name in ['ha-liquid-glass.js', 'configurator.js']:
    html = html.replace(f'<script src="{name}"></script>', '<script>\n' + (root / name).read_text() + '\n</script>')
for name in ['Glass-Vergleich.html', 'Liquid-Glass-Demo.html']:
    (root / name).write_text(html)
files = ['ha-liquid-glass.js', 'INSTALL.md', 'README.md', 'Glass-Vergleich.html', 'Liquid-Glass-Demo.html', 'index.html', 'configurator.js', 'configurator.css', 'test-module.html', 'OPTIK.md', 'build.py']
with ZipFile(root / 'ha-liquid-glass-0.4.0.zip', 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(root / name, name)
