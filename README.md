# Aurora Del Pino Gallardo — portfolio

A static portfolio site built with **Astro 7** and **Tailwind CSS v4**, deployed
to GitHub Pages by GitHub Actions.

Everything on the site is static HTML. There is no client-side framework, no
hydration and roughly 2 KB of JavaScript in total (a scroll-linked measurement
readout, the mobile menu and the theme toggle).

---

## Run it

```bash
npm install
npm run dev        # http://localhost:4321/portfolio/
npm run build      # static output to ./dist
npm run check      # astro check + ESLint + Prettier
npm run fix        # auto-fix formatting and lint
```

> The local URL includes `/portfolio/` because that is the deployment base. See
> **Before you deploy** below.

---

## Editing the site

**You only ever need to touch `src/data/portfolio.ts`.** Every word, project,
date and link on the site is read from that one file. Nothing is hard-coded in
the components.

| Want to change                      | Edit               |
| ----------------------------------- | ------------------ |
| Name, role, location, email         | `profile`          |
| **Her portrait**                    | `profile.portrait` |
| Links (LinkedIn, Dribbble, Behance) | `links`            |
| The sentence under the logotype     | `hero`             |
| Projects, case studies, years       | `work`             |
| Capability lists                    | `capabilities`     |
| Career timeline and education       | `trajectory`       |
| Contact copy and buttons            | `contact`          |
| Page title and meta description     | `seo`              |

### Adding her portrait

Drop the photo in `src/assets/images/` and set one line:

```ts
profile: {
  portrait: {
    src: '~/assets/images/aurora.jpg',
    alt: 'Aurora Del Pino Gallardo, Product Designer in Málaga',
  },
}
```

Any crop works — the portrait is masked to a circle with `overflow: hidden` and
`border-radius`, so only a square centre crop is ever visible and `object-fit:
cover` handles the rest. It is served at 200/320/480/800 wide, converted to
WebP, and the browser is told the real rendered size via `sizes` so it never
downloads more than the circle needs. Leave `src: ''` and the hero falls back
to type only; a path pointing at a file that does not exist fails the build, so
add the file first.

`alt` is not decoration here — write it as a description, not "photo of Aurora".
Because the crop is circular, a square photo is the right source. The circle is
the only curved thing on the page.

### The hero's scroll behaviour

On desktop the hero is a 128vh track holding a `position: sticky` stage one
viewport tall. The name and the portrait open as a single centred lockup, the
name sitting directly above the circle. As you scroll, the portrait travels
right to the content edge and holds there while the name grows into the
full-size logotype and takes the left margin — the two subjects trade places.
The statement arrives on the left during the move and the metadata follows in
flow once the stage releases.

Below 48rem there is no track at all — the portrait sits in normal flow
between the name and the statement, and the page reads as an ordinary
document.

The choreography runs off three registered custom properties. The scroll
handler writes `--progress` (0–1, eased to reach 1 at 55% of the track so the
gesture settles early and then holds), `--travel` (the pixel distance from the
portrait's open position to the right margin) and `--centre-offset` (half the
content width). Position is a `translate` on the compositor so it never
triggers layout. Size is a `font-size` rather than a `transform: scale()`, so
the large glyphs are rasterised at their true size instead of being scaled up
from a cached layer.

Two details worth knowing before you tune the offsets. The name is anchored to
the portrait with `inset-block-start: calc(43% - …)` rather than to its own
`vh` offset, because the portrait's centre is a percentage of the stage while
the name is a fixed number of pixels tall — two independent offsets drift
apart as the viewport gets shorter and the surname ends up overlapping the
circle on a 768px-tall screen. And the track height is the scroll runway: it
is the distance the stage stays pinned for, so shortening it to remove the gap
above the work section also compresses the gesture.

Set `portrait: null` and the hero drops the whole choreography automatically —
the `hero--static` class removes the track and the stage falls back to in-flow
layout, so there is nothing to delete by hand. With `prefers-reduced-motion:
reduce` the progress is pinned to 0, so the portrait simply stays centred and
the name stays small.

### Adding a project

Append an object to the `work` array:

```ts
{
  slug: 'project-name',           // becomes /work/project-name if no url
  title: 'Project Name',
  discipline: 'Product · Sector', // right column, above the year
  year: '2026',
  summary: 'One line. This is what shows in the work list.',
  body: ['Paragraph one.', 'Paragraph two.'],
  image: '~/assets/images/project-name.png',  // optional
  url: 'https://example.com',                 // optional
}
```

Drop the image in `src/assets/images/` and reference it with a `~/assets/...`
path — it gets optimized, resized and given a `srcset` automatically. Without an
image the row still looks composed: the index numeral is set in the well.

---

## Before you deploy

Three things need real values. They are marked `TODO` in the source.

**1. The URL and base path — `src/config.yaml`**

```yaml
site:
  site: 'https://<your-github-username>.github.io/<repo-name>'
  base: '/<repo-name>'
```

- Project repo (e.g. `aurora.github.io/portfolio`) → `base: '/portfolio'`
- User repo (e.g. `aurora.github.io`) → `base: '/'`

`base` must match the repo name, or every asset and anchor link will 404.

**2. An email address — `src/data/portfolio.ts`**

Set `profile.email`. Until you do, every "get in touch" button points at
LinkedIn instead, which is deliberate rather than broken.

**3. The case study detail**

The `TODO(Aurora)` markers inside `work[].body` are real gaps. They mark where
the specific work, the scope and the numbers go. **Nothing on the site was
invented to fill them** — the descriptions of Docline and PROSFY are drawn from
the actual engagements, and the parts only Aurora can supply are left visibly
empty rather than filled with plausible-sounding fiction.

---

## Deploying

Push to `main`. `.github/workflows/deploy.yml` runs the checks, builds, and
publishes to GitHub Pages.

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

The first deployment also publishes to `https://<user>.github.io/<repo>/`,
which you can set as a custom domain later.

---

## How it is put together

```
src/
  data/portfolio.ts        All content. The only file most edits touch.
  components/
    Ruler.astro            The margin ruler (see below)
    Header.astro           Logotype, section nav, mobile panel, theme
    sections/              Hero, Work, Capabilities, Path, Contact
    common/                Metadata, favicons, image pipeline, theme
  layouts/
    Layout.astro           <head>, fonts, colour mode, view transitions
    PageLayout.astro       Header + ruler + main
  assets/styles/tailwind.css   Design tokens, type scale, utilities
```

### The design

The visual direction is typographic Swiss minimalism: white ground, a single
ink, one grey, hairline rules, no shadows and no rounded cards. Sections are
divided by 1px rules rather than boxes, and the work list is a set of rows
rather than a card grid, so the screenshots are the only colour on the page.

**Type** — three roles, deliberately different faces, all self-hosted and
latin-subset by Astro's Fonts API:

| Role    | Face                | Used for                              |
| ------- | ------------------- | ------------------------------------- |
| Display | Instrument Sans 500 | The logotype, at 120px / -4% tracking |
| Body    | Geist               | Prose, at 15px                        |
| Utility | Geist Mono          | Labels, years, the ruler readout      |

### The inverted work section

The work section sits on a full-bleed ink ground between two paper ones, so the
page reads paper → ink → paper and the reader crosses a single hard edge on the
way down. It is one `<div class="invert work-ground" data-ground="dark">` around
the section, and it re-points the same five palette values rather than
introducing a second theme.

`invert` re-declares the Tailwind theme keys as well as the raw tokens, and
that is not redundancy. Tailwind v4's `@theme` block emits
`--color-ash: var(--ash)` on `:root`, and a custom property is substituted
where it is _declared_ — so on `:root` that resolves to the light ash, and the
resolved value is what inherits down. Re-pointing only `--ash` on a wrapper
leaves every `text-ash` inside it still light. `.dark` gets away without this
only because it sits on `<html>`, where both declarations land on the same
element.

`data-ground="dark"` is what the margin ruler watches for. The ruler is
`position: fixed` and spans the viewport, so it cannot inherit the section's
tokens; it swaps to light strokes via an `IntersectionObserver` while any
marked ground is on screen. A `mix-blend-mode: difference` would have done this
in one line, but the ruler covers the viewport, so blending it would force a
full-viewport composite on every scroll frame.

### The margin ruler

The one signature element (`src/components/Ruler.astro`). Two hairlines run the
full viewport height on the content column's edges, ticked every 24px down the
left rule, with a live monospace readout of the page's vertical offset — a
designer's own instrument, drawn to the scale of the page. It comes from the
subject's world rather than from a template.

The hairlines are load-bearing: they are what the sections divide themselves
with, so the ruler is the layout device before it is the decoration. Below
`112rem` the shell is full-bleed, there is no margin to measure, and the
ticks and readout are hidden — the structural hairlines stay.

### Colour and contrast

```
--paper   #ffffff    the page
--ink     #1d1d1e    every glyph, every hairline
--ash     #676d74    the only third voice
--wash    #f4f4f5    image wells
--hairline  rgba(29,29,30,.12)   structural rules
```

`--ash` is **not** the `#828a92` used by the reference this design follows. That
grey measures 3.5:1 on white and fails WCAG AA for body text; `#676d74` keeps the
same cool cast at 5.23:1 on white and 4.76:1 on `--wash`. Shipping a portfolio
with a failing contrast ratio to a designer would be the wrong gift.

Every text pair in the system was measured, in both themes, including the two
that are easy to miss: the year/index labels sitting on `--wash` (4.76:1) and
the 12px mono labels inside the mobile menu, which are white at 70% on the ink
panel — 40% only reached 3.79:1, so it is 70%.

Dark mode is a straight inversion of the same values, not a second design. The
inverted work section re-points those same values too, so in dark mode it blends
into the rest of the page rather than inverting a second time.

### Accessibility

- All text meets WCAG AA (4.5:1); body and utility text included
- One focus treatment site-wide: a 2px ink ring, offset
- Skip-to-content link, `aria-expanded` on the menu, `inert` on the closed panel
- Escape closes the menu
- `prefers-reduced-motion` disables the logotype reveal — the name is simply
  there from the first frame
- The ruler is `aria-hidden` and does not intercept pointer events

---

## Built on

[AstroWind](https://github.com/arthelokyo/astrowind) by
[Arthelokyo](https://arthelokyo.com) — MIT licensed. The demo widgets, demo
pages, blog and most of the original stylesheet were removed; what remains is
the build pipeline, image handling, fonts, SEO and view transitions.
