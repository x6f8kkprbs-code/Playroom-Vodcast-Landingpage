# Hero-Video: KI-generierter Loop in drei Studio-Looks

Datum: 2026-07-13
Status: Design freigegeben, wartet auf Referenzmaterial

## Ziel

Das statische Hero-Bild der Vodcast-Landingpage wird durch einen stummen Video-Loop ersetzt. Der Loop zeigt Menschen im Podcast-Gespräch, nah am Gesicht, in den drei Studio-Looks, die Playroom Studios nach dem Umbau anbietet. Zweck: Bewegung und Emotion im Hero, Qualitätsanspruch sichtbar machen, Bandbreite der Settings zeigen. Es wird nicht behauptet, dass es sich um eigene Produktionen handelt; das Material ist Atmosphäre-Hintergrund.

## Konzept

- Länge: 15-18 Sekunden, Endlos-Loop, ohne Ton
- Aufbau: drei Einstellungen à 5-6 Sekunden, harte Schnitte
- Reihenfolge: hell → warm → schwarz (endet auf dem Look, der Text am besten trägt; die Loop-Naht liest sich als normaler Schnitt)
- Bildsprache: halbnah bis nah am Gesicht. Keine Totale. Das Setting erzählt sich über unscharfen Hintergrund und Licht
- Pro Shot ein anderes Gespräch mit anderen Personen (wirkt wie Einblicke in verschiedene Produktionen)

### Shot-Liste

| Shot | Look | Person / Szene | Look erkennbar durch |
|------|------|----------------|----------------------|
| 1 | Skandinavisch hell | Frau, Anfang 40, spricht lebhaft ins SM7B, Kopfhörer auf | Tageslicht, weiche Wohnzimmer-Unschärfe |
| 2 | Tonstudio (Diffusoren, Couch) | Mann, um 50, hört zu, lacht dann | warmes Licht, Diffusor-Bokeh, LED-Säule amber-orange |
| 3 | Schwarz (Stil Lanz/Precht) | Jüngere Frau, konzentriert im Interview | schwarzer Hintergrund, dramatisches Spotlicht |
| 4 (Reserve) | beliebig | Detail: Hände, Mikro, Kopfhörer | Schnittreserve, kein Gesicht |

Personen: markante, professionelle Business-Gesichter, keine Stock-Optik. Mikro ragt ins Bild, Kopfhörer sichtbar.

## Look-Treue

Die KI-Looks sollen dem geplanten Umbau so nah wie möglich kommen. Grundlage:

- Tonstudio-Look: vorhandene Fotos in `Fotos Vodcast Website/`
- Skandinavisch und Schwarz: Umbaupläne/Renders plus 1-2 Vorbild-Podcasts pro Look (liefert Raul, offen)

Aus den Referenzen entsteht pro Look ein eigener Style-Anchor im Prompt-Kit. Die LED-Säule im Tonstudio-Look wird warm amber-orange geprompted, passend zur Orange-Designsprache der Seite.

## Formate

Jeder Shot wird zweimal generiert:

- 16:9 (1920×1080) für Desktop
- 9:16 nativ für mobil. Nicht aus 16:9 croppen, sondern in Kling direkt im Hochformat generieren (gleicher Still als Referenz, neu geframed)

## Produktions-Workflow

1. Higgsfield Plus-Abo (34 $/Monat, 1.000 Credits, monatlich kündbar)
2. Stills mit Nano Banana Pro, Referenzbilder pro Look anhängen, pro Shot 4-6 Varianten. Gesichter bereits im Standbild prüfen, bevor Video-Credits fließen
3. Beste Stills mit Kling 3.0 Image-to-Video animieren, 5-8 Sekunden, pro Shot und Format 3-4 Varianten. Veo 3.1 nur als Vergleich für 1-2 Schlüssel-Shots
4. Bewegungs-Vorgabe immer: langsam, ruhig, keine schnellen Kamerafahrten, kein Wackeln
5. Schnitt macht Raul im NLE

### Ausschuss-Kriterien

- Hände: falsche Fingeranzahl, verschmelzende Finger
- Nahe Gesichter: wachsige Zähne, flackernde Augen, unnatürlicher Hautglanz. Großzügig Varianten generieren, gnadenlos aussortieren
- Mikrofon-Beschriftung wird zu Kauderwelsch: Beschriftung unscharf halten
- Clips mit unruhigem Anfang/Ende sind schlecht zu schneiden

## Export und Einbau

Export:

- Desktop: 1920×1080, H.264, ohne Tonspur, Ziel 2-4 MB (CRF ~28-30)
- Mobil: 9:16, unter 2 MB

Einbau (eigener Implementierungsschritt, wenn die Loops fertig sind):

- `<video autoplay muted loop playsinline>` mit dem bisherigen Foto als Poster
- Desktop lädt den 16:9-Loop, mobil den 9:16-Loop
- `prefers-reduced-motion`: Video wird nicht geladen, Foto bleibt
- Overlay prüfen: der helle Skandinavien-Shot braucht ggf. stärkeres Overlay oder dunklere Gradierung, damit die weiße H1 lesbar bleibt

## Offene Abhängigkeiten

1. Raul liefert Umbaupläne/Renders und Vorbild-Podcasts für die Looks skandinavisch und schwarz
2. Danach: Prompt-Kit v2 (drei Looks, beide Formate) ersetzt `docs/hero-video-prompt-kit.md`
3. Raul generiert und schneidet
4. Hero-Umbau im Code

## Bewusste Entscheidungen

- KI statt eigenem Dreh: keine Kapazität, Geschwindigkeit zählt, Anfragen laufen bereits
- Nahe Gesichter trotz KI-Risiko: Menschen und Mimik sind der Kern der Aussage, Qualität wird über Varianten-Auswahl gesichert
- Drei verschiedene Gespräche statt Personen-Konsistenz über Looks: einfacher zu generieren und erzählt "hier wird regelmäßig produziert"
