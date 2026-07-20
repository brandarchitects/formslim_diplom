# Diplom Builder – FormSlim & selbergesundwerden

Web-App zum Ausstellen von Kurs-Zertifikaten/Diplomen als A4-PDF – mit
Live-Vorschau, Vorlagen, Zertifikat-IDs und PDF-Export mit eingebetteten
FS-Joey-Schriften. Das Layout folgt verbindlich der Design-Vorlage
`assets/reference/Zertifikat_neu.pdf` (alle Positionen, Schriftgrössen und
Farben wurden direkt aus dem PDF übernommen).

## Deployment auf Vercel (empfohlen)

Das Repository ist für Vercel vorbereitet (`vercel.json`, `.vercelignore` –
statische Site, kein Build nötig):

1. Auf <https://vercel.com/new> das Repository
   `brandarchitects/formslim_diplom` importieren
   (Team «Brand Architects' projects»).
2. Framework Preset: **Other** – Build Command und Output Directory leer
   lassen. **Deploy** klicken.
3. Fertig. Jeder Push auf den Default-Branch deployt automatisch neu.

## Lokal starten

Die App ist eine reine statische Web-App (kein Build, kein Server-Backend).
Sie muss über HTTP ausgeliefert werden, z. B.:

```bash
# im Projektordner:
python3 -m http.server 8000
# oder
npx serve .
```

Danach im Browser öffnen: <http://localhost:8000>

**Login-Passwort:** `diplform0087X`

> Hinweis: Der Login ist ein einfacher Zugriffsschutz auf Oberflächen-Ebene
> (clientseitig). Für echten Schutz die Seite zusätzlich z. B. per
> Basic-Auth/Hosting-Schutz absichern.

## Dateien ablegen

Damit Zertifikate mit echten Logos, Hintergründen und Schriften erzeugt
werden, folgende Dateien ablegen (die App zeigt einen Hinweis, solange etwas
fehlt):

| Datei | Ort |
| --- | --- |
| `FSJoey-Regular.ttf` / `.otf` | `assets/fonts/` |
| `FSJoey-Bold.ttf` / `.otf` | `assets/fonts/` |
| `FSJoey-Heavy.ttf` / `.otf` | `assets/fonts/` |
| `FormSlim.png` | `assets/logos/` |
| `selbergesund.png` | `assets/logos/` |
| `Background_Template.jpg` | `assets/backgrounds/` |
| `Background_Template_green.jpg` | `assets/backgrounds/` |

## Funktionen

- **Zwei Layouts:**
  - *Kurs-Zertifikat* – 1:1 gemäss `Zertifikat_neu.pdf` (Titel, «für»,
    Kursname, «Übergeben an:» mit Namenszeile, Kurstage mit Datum,
    Inhaltsblock, Signaturblock, Fusszeilen) – für **Kinesiologisches
    Testen** und **Kinesiologischer FormSlim-Profi**.
  - *Verleihungs-Zertifikat* – «Dieses Zertifikat wird verliehen an …» – für
    die **selbergesundwerden**-Kurse (NanoCampo-Stoffwechselberater:in,
    FormSlim Stoffwechsel-Berater:in).
- **Zwei Designs:** FormSlim (graues Ornament) und selbergesundwerden
  (grünes Ornament) – pro Vorlage frei kombinierbar.
- **Vorlagen:** Alle Texte sind vorgegeben und unter «Vorlagen» dauerhaft
  anpassbar; beim Ausstellen können sie zusätzlich pro Zertifikat
  überschrieben werden. Eigene Vorlagen können angelegt werden.
- **Individuelle Erfassung:** Name, Kursdaten und Ausstellungsdatum werden
  pro Zertifikat erfasst.
- **Zertifikat-ID:** Jedes Zertifikat erhält automatisch eine eindeutige ID
  (z. B. `FS-KT-2026-A7K3M`), Präfix pro Vorlage einstellbar. Ein
  Ablaufdatum gibt es bewusst nicht – Zertifikate gelten unbefristet.
- **Speichern:** Zertifikate werden lokal im Browser gespeichert
  (localStorage) und können jederzeit erneut exportiert, bearbeitet,
  dupliziert oder gelöscht werden. Backup als JSON-Datei exportier- und
  importierbar.
- **PDF-Export:** Echte Vektor-PDFs (A4) mit eingebetteten
  FS-Joey-Schriften (Subset) – das Layout ist im Export identisch mit der
  Vorschau und verschiebt sich nicht.

## Projektstruktur

```
index.html              App (Login, Builder, Gespeicherte, Vorlagen)
css/styles.css          Oberflächen-Styles
js/app.js               Logik, Layout-Engine, PDF-Export
libs/                   pdf-lib + fontkit (lokal, kein CDN nötig)
assets/fonts/           FS-Joey-Schriften (bitte ablegen)
assets/logos/           FormSlim.png, selbergesund.png (bitte ablegen)
assets/backgrounds/     Background_Template.jpg, *_green.jpg (bitte ablegen)
assets/reference/       Zertifikat_neu.pdf (verbindliche Design-Vorlage)
```
