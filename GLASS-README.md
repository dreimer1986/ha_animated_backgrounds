# Liquid Glass · 0.6.0

`Glass-Test/Glass-Vergleich.html` oder `Glass-Test/Liquid-Glass-Demo.html` direkt in Desktop Chrome/Edge öffnen. Beide enthalten den vollständigen Theme-Konfigurator inklusive HA-Modul und funktionieren offline.

1. **Glasmurmel** für das neue Linsenprofil wählen; alternativ Klarglas, Milchglas oder Extra dick.
2. Stärke, Kantenbreite, Mattierung und Weißanteil einstellen. Die genauen Theme-Schlüssel stehen unter den Reglern; Zahlen lassen sich auch direkt eingeben.
3. Bei Bedarf Profil, CSS-Hintergrund, Schatten und Dialoge anpassen. Ein eigenes Hintergrundbild kann lokal geladen werden.
4. „YAML kopieren“ und die Werte ins vorhandene HA-Theme übernehmen. Gleichnamige bestehende Einträge ersetzen, Themes neu laden.

Die Vorschau rechts verarbeitet dieselben Variablen mit demselben Modul wie HA. Links bleibt das bisherige Profil aus Version 0.3 zum Vergleich; Version 0.1 ist ebenfalls wählbar. Runde Buttons und Suchleisten über bewegter Schrift zeigen die Linsenform. „Textposition“ hält beide Seiten an exakt derselben Stelle an. Hintergrundbild und Bewegung sind reine Vorschauoptionen. Abmessungen, Kartenradien und Hintergrund deiner HA-Installation beeinflussen das endgültige Aussehen.

Das neue `liquid-glass-profile: "lens"` ersetzt die bisherige Randkurve durch ein sphärisches Brechungsprofil. Bestehendes `"convex"` im Theme muss für den neuen Effekt geändert werden. Die alten Profile bleiben auswählbar. Die physikalische Näherung und der Vergleich mit der iPhone-Aufnahme sind in `Glass-Test/OPTIK.md` beschrieben.

## Home Assistant

`www/ha-liquid-glass.js` ist das aktualisierte Frontend-Modul; `Glass-Test/INSTALL.md` erklärt Installation und Update. Das aktuelle Paket heißt `ha-liquid-glass-0.6.0.zip`. Ressourcen-URL: `/local/ha-liquid-glass.js?v=0.6.0`.

Mattierung: `liquid-glass-blur` von 0 bis 40 CSS-Pixel. Milchiger Weißanteil: `liquid-glass-frost` von 0 bis 1. Beide sind standardmäßig 0; die Milchglas-Voreinstellung verwendet 12 und 0.18. Text und Bedienelemente bleiben scharf.

## Schnelleres Laden (0.6.0)

Glas wird bei DOM-/Theme-Änderungen sofort erfasst, auch in später erstellten offenen Shadow Roots. Identische Glasformen verwenden einen begrenzten gemeinsamen Texturcache. Das mitgelieferte Hintergrundskript 1.6.0 wartet bei Seitenwechseln nicht mehr auf Wetterdaten und blockiert den Start nicht auf der optionalen config.json.

**Beide Skripte aktualisieren:** `/local/ha-liquid-glass.js?v=0.6.0` und `/local/styles.js?v=1.6.0`. Die Theme-Werte bleiben erhalten. Details und lokale Vorher/Nachher-Messungen in `Glass-Test/INSTALL.md`.

## Sidebar und UIX

Version 0.5 behandelt optional einzelne Sidebar-Einträge als Glaskapseln. Die aktualisierten Your-Name-Themes aktivieren `liquid-glass-sidebar: "1"` und überlassen dem Modul ihre Füllung. Beim Abschalten greift wieder die bisherige UIX-Füllung. Stärke, Kantenbreite, Mattierung, Rundung, Hintergrund und Schatten sind separat einstellbar und im Konfigurator enthalten. Näheres in `Glass-Test/INSTALL.md`.

## Entwicklung

Die einzige Modulquelle liegt unter `www/ha-liquid-glass.js`. Konfigurator, Vorschau und Tests liegen unter `Glass-Test/`. `python Glass-Test/build.py` erzeugt die beiden eigenständigen HTML-Dateien und `Glass-Test/ha-liquid-glass-0.6.0.zip`. Das ZIP behält die Repository-Struktur mit `www/` und `Glass-Test/` bei. `test-module.html`, `test-sidebar.html`, `test-lifecycle.html` und `test-background.html` enthalten die Browser-Integrationstests; `sidebar-demo.js` stellt die lokale Teststruktur bereit. Frühere Versionen bleiben im ursprünglichen Download-Ordner.

Native Hintergrundfilter, keine Bildschirmaufnahmen oder laufenden Hintergrundkopien. Version 0.4 wurde vom Nutzer erfolgreich in Chrome für Android und in der offiziellen Home-Assistant-App getestet. Die Sidebar-Erweiterung ist lokal geprüft, noch nicht auf seinem Gerät. Mobile Browser sind standardmäßig gesperrt, die Your-Name-Themes erlauben sie mit `liquid-glass-mobile: "1"`. Der Konfigurator hat denselben Schalter. Alternativ die HA-URL um `?liquid_glass_mobile=on` ergänzen. CSS.supports bestätigt nur Syntaxunterstützung, nicht das tatsächliche Rendering.
