"""Build offline configurators from the canonical www module; retain repo layout."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent
repo = root.parent
module = repo / 'www/ha-liquid-glass.js'
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="configurator.css">', '<style>\n' + (root / 'configurator.css').read_text() + '\n</style>')
for src, path in [('../www/ha-liquid-glass.js', module), ('sidebar-demo.js', root / 'sidebar-demo.js'), ('configurator.js', root / 'configurator.js')]:
    html = html.replace(f'<script src="{src}"></script>', '<script>\n' + path.read_text() + '\n</script>')
for name in ['Glass-Vergleich.html', 'Liquid-Glass-Demo.html']:
    (root / name).write_text(html)
files = ['INSTALL.md', 'Glass-Vergleich.html', 'Liquid-Glass-Demo.html', 'index.html', 'configurator.js', 'configurator.css', 'test-module.html', 'test-sidebar.html', 'test-lifecycle.html', 'test-background.html', 'sidebar-demo.js', 'OPTIK.md', 'build.py']
with ZipFile(root / 'ha-liquid-glass-0.6.0.zip', 'w', ZIP_DEFLATED) as archive:
    archive.write(module, 'www/ha-liquid-glass.js')
    archive.write(repo / 'www/styles.js', 'www/styles.js')
    archive.write(repo / 'GLASS-README.md', 'GLASS-README.md')
    for name in files:
        archive.write(root / name, 'Glass-Test/' + name)
