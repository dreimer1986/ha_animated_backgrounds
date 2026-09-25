# Home Assistant Liquid Glass · 0.4.0

Experimentelles Frontend-Modul aus dem visuellen Prototyp. Es enthält CSS und JavaScript in einer Datei. Kein UIX erforderlich; UIX kann zusätzlich für Ausnahmen genutzt werden. Keine Verbindung zu Diensten, kein Token nötig.

## Neu in 0.4.0: Linsenprofil „Glasmurmel“

`liquid-glass-profile: "lens"` ist das neue Standardprofil. Die frühere breit verschiebende Randkurve wird durch eine aus Snells Gesetz abgeleitete Kurve für eine sphärische Eintrittsfläche ersetzt (Brechungsindex 1.5). Sie vergrößert im Inneren gleichmäßiger und biegt das Hintergrundbild nahe dem äußeren Rand stärker um. Kreise erhalten radiale Brechung; Kapseln haben runde Enden und einen zylindrischen Querschnitt im langen Mittelteil.

Für eine vollständig gewölbte 76 Pixel hohe Schaltfläche muss die Kantenbreite mindestens 38 sein. Kleinere Werte lassen eine flache Mitte; höhere Werte werden wie bisher auf die halbe kleinere Abmessung begrenzt. Das Modul verändert die vorhandenen Kartenradien nicht und macht aus einer eckigen HA-Karte keinen runden Button.

**Im Konfigurator „Glasmurmel“ wählen.** Die Voreinstellung verwendet Stärke 72, Kantenbreite 64, Mattierung 1, Weißanteil 0.08 sowie eine helle Glastönung und angepasste Lichtkanten. Alle Werte einschließlich Hintergrund und Schatten stehen im exportierten YAML. Große Karten lassen sich danach nach Geschmack weniger stark mattieren.

**Beim Update ausdrücklich `liquid-glass-profile: "lens"` setzen**, wenn im bisherigen Theme noch `"convex"` steht. `"convex"` erhält das Profil aus 0.2/0.3; `"legacy"` das aus 0.1. Der neue Standard greift nur ohne explizite alte Profilauswahl.

Die Vergleichsseite zeigt jetzt runde Buttons und Suchleisten über bewegter Schrift. „Textposition“ hält beide Textflächen an derselben Stelle an; die Einstellung ist nur eine Vorschauhilfe und wird nicht exportiert. Links lässt sich zwischen 0.3 und 0.1 umschalten. Mobile Freischaltung bleibt beim Wechsel einer Materialvoreinstellung erhalten.

Die Aufnahme `PXL_20260925_152628560.TS.mp4` war die visuelle Referenz. Dies ist eine optische Annäherung an das beobachtete Verhalten, keine vermessene oder pixelidentische Kopie des Apple-Renderers. Details des Modells und Grenzen stehen in `OPTIK.md`.

## Mattierung und Konfigurator (seit 0.3.0)

Einstellbare Milchglas-Mattierung mit zwei unabhängigen Theme-Werten:

- `liquid-glass-blur`: 0–40 CSS-Pixel, Standard 0. Macht den Hintergrund vor der Brechung unscharf; der Karteninhalt bleibt scharf.
- `liquid-glass-frost`: 0–1, Standard 0. Weißer Schleier über dem Hintergrund; 1 ist vollständig deckend. Beispiel für Milchglas: Blur 12, Frost 0.18.

`Glass-Vergleich.html` und `Liquid-Glass-Demo.html` sind eigenständige Theme-Konfiguratoren. Sie verwenden dasselbe HA-Modul und dieselben CSS-Variablen wie die Installation. Alle zehn Modulvariablen sind einstellbar: Aktivierung, mobile Freischaltung, Stärke, Kantenbreite, Mattierung, Weißanteil, Profil, Hintergrund, Schatten und Dialoge. Der YAML-Block übernimmt genau die gültigen Formularwerte. Ungültige CSS-Eingaben ändern weder Vorschau noch Export. „YAML kopieren“ kopiert die Werte; falls der Browser den Zugriff verweigert, wird der Text zur manuellen Übernahme markiert.

Die linke Vergleichskarte verwendet standardmäßig das bisherige gewölbte Profil mit 72 / 48 (umschaltbar auf das Original mit 22 / 26), rechts gelten die Formularwerte. Die Dialog-Vorschau verwendet ein simuliertes `wa-dialog` mit offenem Shadow Root. Hintergrundwahl, eigene lokale Bilder und Bewegung sind reine Vorschau-Einstellungen und werden nicht exportiert. Abmessungen, Radien und Hintergründe beeinflussen das Ergebnis auch in HA.

**Update:** JavaScript-Datei ersetzen, Ressourcen-URL auf `?v=0.4.0` ändern und Browser neu laden. Theme-Werte aus dem Konfigurator im bestehenden Theme auf derselben Ebene wie `ha-card-background` eintragen; gleichnamige alte Einträge ersetzen. Die Versionsstände 0.1.0, 0.2.0 und 0.3.0 bleiben in ihren ZIPs und unter `backups/` erhalten.

Das gewölbte Profil verwendet standardmäßig Stärke **72** und Kantenbreite **48**; „Extra dick“ stellt **110 / 64** ein. `liquid-glass-profile: "lens"` ist das Standardprofil; `"convex"` erhält das bisherige gewölbte Profil und `"legacy"` wählt die ursprüngliche Kurve. Alle bleiben optische Näherungen.

## Installation: eine der beiden Varianten wählen

Die Datei `ha-liquid-glass.js` nach `/config/www/ha-liquid-glass.js` kopieren (je nach Installation heißt der Konfigurationsordner `/homeassistant`). Sie ist danach unter `/local/ha-liquid-glass.js` erreichbar.

### A: Dashboard-Ressource

Einstellungen → Dashboards → Ressourcen (gegebenenfalls erweiterten Modus im Profil aktivieren):

- URL: `/local/ha-liquid-glass.js?v=0.4.0`
- Typ: **JavaScript-Modul**

Dashboard neu laden. Ressourcen sind nicht auf eine einzelne Ansicht beschränkt. Das Modul bleibt in dieser Browserseite aktiv, bis sie neu geladen wird.

Bei YAML-verwalteten Ressourcen lautet der Eintrag unter der vorhandenen `lovelace.resources`-Liste:

```yaml
- url: /local/ha-liquid-glass.js?v=0.4.0
  type: module
```

### B: gesamtes Frontend

In den **bestehenden** `frontend:`-Block in `configuration.yaml` integrieren. Bestehende Themes und Modul-URLs beibehalten, keinen zweiten `frontend:`-Block erstellen:

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/styles.js?v=1.5
    - /local/ha-liquid-glass.js?v=0.4.0
```

Die vorhandene URL deines Hintergrundskripts unverändert übernehmen; die obige Version ist nur ein Beispiel. Konfiguration prüfen, HA neu starten und Browser vollständig neu laden. Nur Theme-Neuladen aktiviert keinen neuen `extra_module_url`-Eintrag.

## Verhalten und Einstellungen

Standardmäßig aktiviert sich der Effekt in Desktop Chrome/Edge für äußere `ha-card`-Flächen, auch in offenen Shadow Roots. Andere Browser und standardmäßig mobile User Agents werden ausgelassen und behalten das bestehende Theme. Die mobile Sperre ist eine konservative Einschränkung des Prototyps, kein belegter genereller Ausschluss von SVG-Backdrop-Filtern auf Android. Echte Android-Geräte wurden hier nicht getestet. Diese Eingrenzung ist keine vollständige Rendering-Erkennung.

Größe und Rundung werden automatisch erfasst; die Rundung der linken oberen Ecke dient als Näherung für alle vier Ecken. Neue Karten, Theme-Wechsel und spät erstellte Shadow Roots werden spätestens beim 3-Sekunden-Abgleich erkannt. Entfernte Karten werden aufgeräumt. Es gibt keinen Hintergrund-Screenshot und keine laufende Video-Kopie. Verzerrungskarten werden nur bei Größen-/Formänderungen neu erzeugt. Große Filtertexturen werden auf maximal 768 Pixel je Achse begrenzt.

Optional im **bestehenden Theme** ergänzen (gleiche Einrückung wie `ha-card-background`):

```yaml
  liquid-glass-enabled: "1"
  liquid-glass-mobile: "0"
  liquid-glass-strength: "72"
  liquid-glass-bevel: "48"
  liquid-glass-blur: "12"
  liquid-glass-frost: "0.18"
  liquid-glass-profile: "lens"
  liquid-glass-background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(16,12,42,0.22))"
  liquid-glass-dialogs: "0"
```

`strength`: 0–160 (SVG-Skalierung; maximaler tatsächlicher Versatz ungefähr die Hälfte), `bevel`: 4–160 CSS-Pixel. Bei flachen Karten wird die Kantenbreite automatisch auf die halbe Kartenhöhe begrenzt. `enabled: "0"` schaltet den Effekt für dieses Theme aus. Anschließend Themes neu laden. Die Filter werden nach spätestens drei Sekunden aktualisiert. Vorhandene Kartenabmessungen, Positionierung, Interaktion und Radien bleiben erhalten; Hintergrund, Schatten und Backdrop-Filter werden während der Aktivierung überschrieben.

### Chrome auf Android freischalten

Im Theme `liquid-glass-mobile: "1"` setzen und Themes neu laden. Die Änderung wird spätestens beim nächsten 3-Sekunden-Abgleich übernommen. `"0"` (Standard) deaktiviert die mobilen Glasflächen wieder. In der Testseite gibt es denselben Schalter; er gilt dort auch für die linke Vergleichsfläche.

Für einen einmaligen Test ohne Theme-Änderung `?liquid_glass_mobile=on` an die HA-URL hängen (bei vorhandenen Parametern `&liquid_glass_mobile=on`) und neu laden. Dieser URL-Schalter übersteuert die mobile Sperre, aber nicht `liquid-glass-enabled: "0"` oder `?liquid_glass=off`. Zum Rückweg den Parameter entfernen und neu laden.

Dies hebt nur die vorsorgliche mobile Sperre auf. Die Chromium-/Syntaxprüfung bleibt aktiv; die Freischaltung garantiert kein korrektes Rendering. `window.haLiquidGlass.status` zeigt `mobile`, `mobileOverride` und die Anzahl aktiver `surfaces`. Der Schalter wurde mit Android-Browserkennzeichen im Desktop-Browser geprüft; das ersetzt keinen Gerätetest.

### Dialoge als zweiter Test

`liquid-glass-dialogs: "1"` aktiviert zusätzlich erkannte `wa-dialog`-Dialogflächen und ältere MDC-Dialogflächen. Das ist versionsabhängig und wurde noch nicht an deiner HA-Installation geprüft. Ein vorhandener dunkler/unscharfer Dialog-Scrim bleibt erhalten und kann die Brechung weniger sichtbar machen. Innere Karten bleiben eigene Glasflächen: bei solchen Verschachtelungen gelten die Backdrop-Root-Grenzen des Browsers.

Header, Sidebar, Menüs, geschlossene Shadow Roots und Custom Cards ohne `ha-card` werden nicht automatisch verändert. Ein eigenes erreichbares DOM-Element lässt sich mit `data-liquid-glass` ausdrücklich markieren; dies ist kein beliebiger Lovelace-YAML-Schlüssel.

### Einzelne Karte ausschließen (UIX)

Im passenden `ha-card`-Style dieser Karte setzen:

```css
ha-card { --liquid-glass-enabled: 0; }
```

Alternativ an einem Element/Container das DOM-Attribut `data-liquid-glass-ignore` setzen. Untergeordnete Elemente werden dann ebenfalls ausgelassen. Verschachtelte `ha-card`-Karten werden standardmäßig nur auf der äußeren Ebene behandelt.

## Rückweg und Diagnose

- Zum temporären Start ohne Effekt `?liquid_glass=off` an die HA-URL hängen, bzw. `&liquid_glass=off` bei vorhandenen Parametern, und neu laden.
- Sofort für die aktuelle Seite abschalten: Browserkonsole → `window.haLiquidGlass.stop()`. Entfernt die vom Modul erzeugten Styles und Filter. Ein Neuladen aktiviert es wieder.
- Status: `window.haLiquidGlass.status`.
- Dauerhaft entfernen: Ressourcen-/Frontend-Eintrag entfernen und neu laden; bei `configuration.yaml` vorher HA neu starten.
- Bei Dateiupdates die Versionsnummer hinter `?v=` ändern.

## Testumfang

Mit Version 0.4.0 in lokalem Headless-Chrome bestanden: Erkennung in Shadow Roots, Ausschluss innerer Karten, Filterreferenz im selben DOM-Baum, Größenänderung, Hinzufügen/Entfernen von Karten, Deaktivieren/Reaktivieren per CSS-Variable, doppeltes Laden ohne doppelte Instanz und vollständiges Aufräumen beim Stoppen. Zusätzlich geprüft: stärkerer Standardwert, neutraler Mittelpunkt, mehr als 30 CSS-Pixel Randversatz, Stärke 0 und 110 sowie Profilwechsel. Zusätzlich geprüft: radiale Symmetrie, gegenüberliegende Linsenseiten, gleicher Kreis-/Kapselquerschnitt, Vergrößerung ohne Umkehr im Inneren, Umkehr nahe dem Rand und die weiterhin auswählbare alte Kurve. Den Vorher/Nachher-Vergleich visuell kontrolliert. Die Tests sind in `test-module.html` enthalten. Zusätzlich wurden Mattierung, Weißanteil, unverzerrter Karteninhalt, Rückkehr zu Klarglas und die Blur-Obergrenze geprüft. Der Konfigurator wurde auf direkte Dateiöffnung, YAML-/Vorschau-Übereinstimmung, Voreinstellungen, Dialoge, CSS-Validierung, Kopieren und schmale Fenster geprüft.

Keine Freigabe für alle HA-Karten oder HA-Versionen. Noch nicht an deiner laufenden HA-Installation getestet. Besonders zu prüfen: Standardkarten, Navigation, Fenstergröße, More-Info-Dialog über Karten und Lesbarkeit vor deinem animierten Hintergrund.

Quellen: https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript und https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/
