# Hero-Video Prompt-Kit (Higgsfield)

Ziel: 15-20 Sekunden stummer Video-Loop als Hero-Hintergrund. Zwei bis drei interessante, professionell aussehende Menschen im Podcast-Gespräch, in einem Studio das aussieht wie unseres. Textoverlay liegt darüber, also ruhige Bewegung und gedeckte Helligkeit.

## Workflow

1. **Higgsfield Plus abonnieren** (34 $/Monat, 1.000 Credits, monatlich kündbar).
2. **Stills generieren** mit Nano Banana Pro (2 Credits pro Bild). Als Referenzbilder 2-3 echte Studiofotos hochladen (`Fotos Vodcast Website/DSCF0058.jpg` und ähnliche). Pro Shot 4-6 Varianten ziehen, bis Personen und Look sitzen.
3. **Beste Stills animieren** mit Kling 3.0 Image-to-Video (günstig, aktuell Leaderboard-Spitze). Veo 3.1 nur für die 1-2 wichtigsten Shots als Vergleich (teurer, 40-70 Credits).
4. **Schnitt** in Deinem NLE: 4-6 Clips à 3-5 Sekunden zu einem Loop schneiden. Letzter Clip sollte weich zurück zum ersten führen.
5. Export: 16:9, 1920×1080, H.264, ohne Tonspur, Ziel 2-4 MB (CRF ~28-30, ggf. zusätzlich H.265/WebM-Variante).

## Style-Anchor (an jeden Prompt anhängen)

```
Setting: modern corporate podcast studio, warm sand-beige acoustic walls,
white wooden skyline diffuser panels, a vertical recessed LED light column
glowing warm amber-orange, light felt-covered desks, black Shure SM7B
microphones on desk-mounted boom arms, black studio headphones, small green
plants, silver articulated desk lamps. Cinematic 35mm look, shallow depth of
field, soft warm key light, natural skin tones, subtle film grain,
documentary realism. Muted, calm, premium corporate atmosphere.
```

Wichtig: Die LED-Säule immer **warm amber-orange** prompten (nicht teal/pink), damit das Video zur Orange-Designsprache der Seite passt.

## Personen-Beschreibung (variieren)

```
A: confident businesswoman, early 40s, tailored navy blazer, natural styling
B: businessman, around 50, grey hair, open shirt under dark suit jacket
C: younger professional woman, mid 30s, minimalist business casual
All: engaged, authentic expressions, mid-conversation, headphones on
```

Interessant statt austauschbar: markante Gesichter, echte Mimik, keine Modeltypen. Bei Bedarf ergänzen: `distinctive, characterful faces, editorial photography style, not stock-photo generic`.

## Shot-Liste (Still-Prompts für Nano Banana Pro)

Jeweils + Style-Anchor. Referenzfotos anhängen mit Hinweis `match the studio environment from the reference images`.

1. **Totale / Establishing**
   `Wide shot of two professionals in conversation across a podcast desk, both wearing headphones, speaking into SM7B microphones, warm LED column between them in the background`
2. **Close-up Sprecherin**
   `Medium close-up of the businesswoman speaking into a black SM7B microphone, headphones on, animated expression, blurred warm studio background`
3. **Zuhörer reagiert**
   `Medium shot of the man listening attentively, slight nod, hint of a smile, headphones on, microphone in soft-focus foreground`
4. **Hände / Gestik**
   `Close-up of expressive hands gesturing while talking, felt desk surface, notepad and pen, microphone base in frame, warm bokeh`
5. **Detail Mikrofon + Kopfhörer**
   `Extreme close-up of a black SM7B microphone, a person's lips speaking slightly out of focus behind it, warm rim light from the LED column`
6. **Over-Shoulder**
   `Over-the-shoulder shot past the woman towards the man talking, both with headphones, depth-of-field, warm amber studio light`

## Video-Prompts (Kling 3.0, Image-to-Video, 5-8 s pro Clip)

Still als Startframe hochladen, dann Bewegung beschreiben. Kein Ton nötig.

- Totale: `Slow subtle dolly-in. The two people are in relaxed conversation, natural gestures, occasional nodding and laughing. Calm, steady camera.`
- Close-ups: `The person speaks naturally with lively facial expressions, subtle head movement. Very slow camera drift to the left. No cuts.`
- Hände: `Hands gesture naturally while talking, slow shallow rack focus between hands and microphone.`
- Detail: `Barely perceptible slow push-in on the microphone, lips moving softly out of focus in the background.`

Immer ergänzen: `slow, smooth, minimal camera movement, no fast motion, no camera shake, consistent lighting`.

## Worauf achten (Ausschuss-Kriterien)

- Hände: sechs Finger, verschmelzende Finger am Mikro → verwerfen
- Zähne/Mund in Nahaufnahme: wachsig oder flackernd → Shot halbnah statt formatfüllend
- Logos/Text im Bild (Mikrofon-Beschriftung wird gern zu Kauderwelsch) → Shot so wählen, dass Beschriftung unscharf ist
- Loop-Tauglichkeit: Clips mit ruhigem Anfang/Ende bevorzugen

## Hero-Einbau (wenn Clips fertig)

- `<video autoplay muted loop playsinline poster="…">` mit dem bisherigen Foto als Poster
- Mobil: statisches Bild behalten (Datenvolumen, Autoplay-Restriktionen)
- `prefers-reduced-motion`: Video nicht laden, Foto zeigen
- Overlay ggf. leicht verstärken, damit H1 lesbar bleibt
