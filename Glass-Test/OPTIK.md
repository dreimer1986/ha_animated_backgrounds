# Optikvergleich · 0.4.0

## Referenz und Beobachtung

Lokale Referenz: `PXL_20260925_152628560.TS.mp4`, insbesondere Frames bei 2, 5 und 7 Sekunden. Der runde Button zeigt radial gekrümmte Schrift, die längliche Suchfläche eine vergleichbare Krümmung an den Enden sowie eine vertikale Dehnung entlang der langen Kanten. Das Vordergrundsymbol bleibt scharf. Eine leichte Mattierung/Tönung schwächt den Kontrast des Hintergrunds ab.

Das bisherige Profil `(1 - t²)²` hatte seine stärkste Änderung zu weit innen. Auf kleinen, vollständig gewölbten Flächen fällt seine Brechkraft nahe dem Mittelpunkt gegen null; an anderer Stelle werden Buchstaben stark gedehnt oder umgeklappt. Mehr Stärke verstärkt diesen Verlauf, korrigiert aber nicht seine Form.

## Neues Profil

Für die Distanz d nach innen und die Kantenbreite b gilt t = clamp(d/b, 0, 1), u = 1 - t. Bei einer sphärischen Eintrittsfläche entspricht u dem Sinus des Einfallswinkels. Mit einem fest gewählten Glas-Brechungsindex n = 1.5:

- Einfallswinkel: θi = asin(u)
- Winkel im Glas: θt = asin(u/n)
- normierter seitlicher Versatz: tan(θi − θt) / sqrt(n² − 1)

Die SDF-Normale der gerundeten Fläche gibt die Richtung an. Die SVG-Abtastung erfolgt nach innen. Im Inneren ist der Versatz näherungsweise linear: eine echte lokale Vergrößerung statt einer flachen Scheibe. Die steilere Randkurve kann den Verlauf im äußersten Bereich umkehren und dadurch das beobachtete umgebogene Bild erzeugen. Die Stärke skaliert weiterhin den maximalen Randversatz; der theoretische Maximalwert liegt ungefähr bei Stärke / 2 CSS-Pixeln.

Für Kreise/Kapseln mit Kantenbreite mindestens halber Höhe erstreckt sich die Linse über den gesamten Querschnitt. Große Karten mit schmaler Kante behalten eine flache Mitte. An kleinen Linsen wird die Map mit bis zu zwei Texeln pro CSS-Pixel erstellt, weiter auf maximal 768 Texel je Achse begrenzt. Das Normalenfeld wird außerhalb der gerundeten Silhouette fortgesetzt, damit die Interpolation am sichtbaren Rand nicht in ein neutrales Feld springt. Der Browser beschneidet den Backdrop an der CSS-Rundung.

## Was dies nicht behauptet

Das ist eine Einzelgrenzflächen-Näherung mit virtueller Abtastebene, keine vollständige Strahlverfolgung durch eine massive Glaskugel. Brechungsindex, Abtastebene und Materialtönung sind Modellentscheidungen, keine aus dem Video gemessenen Apple-Parameter. Apples dynamische Lichtreflexe, materialabhängige Anpassung und exakte Shader sind nicht nachgebildet. Kamera, Perspektive, Display und Aufnahme-Weichzeichnung verhindern hier einen belastbaren pixelweisen Vergleich.

Die lokale Browserprüfung verifiziert die grundlegende Linsengeometrie und die HA-Anbindung. Ein echter iPhone-/Android-/HA-Gerätetest wurde in dieser Umgebung nicht durchgeführt.

## Fachliche Quellen

- Apple: [Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/) beschreibt Lichtbrechung, Linsenwirkung und die von der Größe abhängige Materialwirkung; veröffentlicht dort keine nachbaubare Shaderformel.
- PBRT: [Specular Reflection and Transmission](https://www.pbr-book.org/4ed/Reflection_Models/Specular_Reflection_and_Transmission) erläutert Snells Gesetz und die Beziehung zwischen Einfalls- und Brechungswinkel.
