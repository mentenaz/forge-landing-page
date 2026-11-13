# Fonts

The site's three fonts, served from here by `next/font/local` in
`src/app/layout.tsx`, so a visitor's browser does not have to fetch a stylesheet
from another host before the page can show.

| File | Font | Weights | Subset |
| --- | --- | --- | --- |
| `oxanium-latin.woff2` | Oxanium (headings) | 200 to 800, one variable file | latin |
| `outfit-latin.woff2` | Outfit (body) | 100 to 900, one variable file | latin |
| `cascadia-code-latin.woff2` | Cascadia Code (code) | 200 to 700, one variable file | latin |

All three are licensed under the SIL Open Font License 1.1, which allows them
to be served with a site. They are the files Google Fonts serves for these
families (Oxanium v21, Outfit v15, Cascadia Code v5). To update one, download the
latest `latin` woff2 from `https://fonts.googleapis.com/css2?family=<Name>` and
replace the file here.

A character outside the latin subset falls back to the system font, as it did
before.
