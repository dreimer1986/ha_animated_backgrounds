# Liquid Glass · 0.4.0

`Glass-Vergleich.html` oder `Liquid-Glass-Demo.html` direkt in Desktop Chrome/Edge öffnen. Beide enthalten den vollständigen Theme-Konfigurator inklusive HA-Modul und funktionieren offline.

1. **Glasmurmel** für das neue Linsenprofil wählen; alternativ Klarglas, Milchglas oder Extra dick.
2. Stärke, Kantenbreite, Mattierung und Weißanteil einstellen. Die genauen Theme-Schlüssel stehen unter den Reglern; Zahlen lassen sich auch direkt eingeben.
3. Bei Bedarf Profil, CSS-Hintergrund, Schatten und Dialoge anpassen. Ein eigenes Hintergrundbild kann lokal geladen werden.
4. „YAML kopieren“ und die Werte ins vorhandene HA-Theme übernehmen. Gleichnamige bestehende Einträge ersetzen, Themes neu laden.

Die Vorschau rechts verarbeitet dieselben Variablen mit demselben Modul wie HA. Links bleibt das bisherige Profil aus Version 0.3 zum Vergleich; Version 0.1 ist ebenfalls wählbar. Runde Buttons und Suchleisten über bewegter Schrift zeigen die Linsenform. „Textposition“ hält beide Seiten an exakt derselben Stelle an. Hintergrundbild und Bewegung sind reine Vorschauoptionen. Abmessungen, Kartenradien und Hintergrund deiner HA-Installation beeinflussen das endgültige Aussehen.

Das neue `liquid-glass-profile: "lens"` ersetzt die bisherige Randkurve durch ein sphärisches Brechungsprofil. Bestehendes `"convex"` im Theme muss für den neuen Effekt geändert werden. Die alten Profile bleiben auswählbar. Die physikalische Näherung und der Vergleich mit der iPhone-Aufnahme sind in `OPTIK.md` beschrieben.

## Home Assistant

`ha-liquid-glass.js` ist das aktualisierte Frontend-Modul; `INSTALL.md` erklärt Installation und Update. Das aktuelle Paket heißt `ha-liquid-glass-0.4.0.zip`. Ressourcen-URL: `/local/ha-liquid-glass.js?v=0.4.0`.

Mattierung: `liquid-glass-blur` von 0 bis 40 CSS-Pixel. Milchiger Weißanteil: `liquid-glass-frost` von 0 bis 1. Beide sind standardmäßig 0; die Milchglas-Voreinstellung verwendet 12 und 0.18. Text und Bedienelemente bleiben scharf.

## Entwicklung

`index.html`, `configurator.css`, `configurator.js` und `ha-liquid-glass.js` sind die Quelldateien. `python build.py` erzeugt beide eigenständigen HTML-Dateien und das ZIP. `test-module.html` enthält die Browser-Integrationstests. `glass.js` und `style.css` sind verbliebene Quellen des früheren Prototyps und werden vom aktuellen Konfigurator nicht geladen. Frühere Versionen sind unter `backups/` und als ZIP erhalten.

Native Hintergrundfilter, keine Bildschirmaufnahmen oder laufenden Hintergrundkopien. Desktop Chromium lokal getestet, die laufende HA-Installation und echte Android-Geräte nicht. Mobile Browser sind standardmäßig gesperrt. Zum Testen in Chrome auf Android „Mobile Browser freischalten“ aktivieren oder im Theme `liquid-glass-mobile: "1"` setzen. Alternativ die HA-URL um `?liquid_glass_mobile=on` ergänzen. CSS.supports bestätigt nur Syntaxunterstützung, nicht das tatsächliche Rendering.
