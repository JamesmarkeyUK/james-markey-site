# Blue Sardinia — Guildford

A modern, improved recreation of [bluesardinia.co.uk](https://www.bluesardinia.co.uk/),
the family-run Sardinian & Italian restaurant on Sydenham Road in Guildford.

This is a self-contained, dependency-free static website — open it and it runs.

## What's inside

```
Sardinia/
├── index.html        # single-page site
├── css/styles.css    # all styling (Mediterranean palette, responsive)
├── js/main.js        # nav, menu tabs, scroll reveal, booking form
├── assets/favicon.svg
└── README.md
```

## Running it

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
cd Sardinia
python3 -m http.server 8000
# visit http://localhost:8000
```

## How it improves on the original

- **Modern, responsive design** — a Mediterranean "sea & gold" palette, fluid
  type, and a layout that works from phone to desktop.
- **Real navigation & structure** — sticky header, a single scrollable story
  (Story → Menu → Experiences → Gallery → Reviews → Visit) with a working
  mobile menu.
- **Interactive tabbed menu** — antipasti, primi, secondi, dolci and a dedicated
  vegan/gluten-free section, with chef's-pick and dietary tags.
- **Working booking request form** — client-side validation, no past dates,
  and a friendly confirmation (wire it to an email/booking backend to go live).
- **Accessibility & performance** — semantic HTML, ARIA on tabs/nav, visible
  focus states, `prefers-reduced-motion` support, lazy-loaded images.
- **SEO ready** — descriptive metadata, Open Graph tags and `Restaurant`
  schema.org structured data (address, hours, cuisine).

## Notes

Content (menu, prices, copy, reviews) is illustrative, written to reflect the
restaurant's authentic Sardinian character. Replace with live details before
publishing. Photography is loaded from Unsplash via hotlink for the demo;
swap in the restaurant's own images for production. The booking form is
front-end only and needs a backend (or a service such as Formspree / OpenTable)
to actually send reservations.
