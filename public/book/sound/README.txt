Page-turn sounds.

Drop your own files here with exactly these names:

  page-turn.mp3    played on every page turn
  cover-turn.mp3   played when the cover opens or closes (optional —
                   without it the cover borrows page-turn.mp3)

Any format the browser can decode works: mp3, m4a, wav, ogg. Keep them short
(under about half a second) — this is a tick as the page is released, not a
recording of a whole turn.

With no files here, a synthesised tick is used instead, so the book is never
silent and a missing file never shows as an error. Level is SAMPLE_VOLUME in
src/pages/bookSound.ts.
