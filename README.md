# RESPLE2 website

This is a local starting point based on `resple_web`, with a fixed top navigation
bar and responsive layout in a single page. The YouTube player appears directly
before Citation. Dataset video sections follow the methodology.
The original project was not modified.

## Where to put your new content

Edit the HTML fragments in **`content/`**. Original RESPLE text, authors,
publication links, citation, datasets, and media are examples, not RESPLE2 claims.
Replace them before publishing. Keep the HTML classes and section IDs to retain
the layout and navigation. You can edit text between tags and replace `href`
and `src` values without changing the surrounding markup.

| Content | File or folder |
| --- | --- |
| Project title, authors, affiliations, venue, resource buttons | `content/index/01-home.html` |
| Abstract | `content/index/03-abstract.html` |
| Methodology video and description | `content/index/04-methodology.html` |
| YouTube player | `content/index/06-youtube.html` |
| Citation and BibTeX entry | `content/index/07-citation.html` |
| HOPPER, TANKI, GrandTour, HANDI, and JEPLO videos | `content/datasets/02-platform-videos.html` |
| Browser titles and search/social descriptions | `content/site.json` |
| Images and result figures | `static/images/` |
| MP4 videos | `static/videos/` |

The methodology fragment uses the pipeline video with blank borders cropped:

```html
<source src="static/videos/pipeline_web_cropped.mp4" type="video/mp4">
```

The original `static/videos/pipeline_web.mp4` is retained alongside the cropped version.

Paths in content fragments are relative to the final root HTML page, not to the
fragment's directory. Use YouTube's `/embed/VIDEO_ID` URL for the iframe.

Each platform has its own video section. HOPPER uses `hopper_web.mp4`, TANKI uses
`tanki_web.mp4`, and GrandTour uses `grandtour_forest_web.mp4`. HANDI uses
`azout2_web.mp4`, `arout_web.mp4`, and `dyn4_web.mp4`, captioned `az-out2`,
`ar-inout`, and `az-dyna4`. The HANDI videos are stacked, each filling its row.
JEPLO uses `eilbox_web.mp4`. A single video fills its row in the other sections.
To replace a clip, update its `<source>` and fallback download link in the
platform video fragment.

## Build and preview

From this folder, run:

```sh
python3 scripts/build.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. After editing content, run the build again and
refresh the browser. Stop the preview with Ctrl+C. No packages are required.
The build versions the custom CSS and JavaScript URLs so a refresh loads the
latest styles and navigation code after edits.

The generated `index.html`, together with `static/`, can be served by any static
host, including GitHub Pages. These are committed as ordinary static files; the
host does not need Python. Do not edit `index.html` directly: rebuilding
overwrites it. Dataset fragments remain in their folder under
`content/` and are included in the homepage; there are no separate subpages.

## Layout and navigation

`templates/index.html` contains the page shell, top navigation, metadata, and footer.
`static/css/index.css` controls the original custom layout; `static/js/index.js`
controls navigation. To rename a dataset section, update its
heading in `content/` and any corresponding navigation labels in the template.
Keep section IDs and navigation `href="#..."` targets in sync. The top bar
highlights the current section, shrinks from 64px to 52px over the first 120px of
scrolling, and becomes a menu button below 960px. Its mobile
drawer closes when you choose a section, click the backdrop, or press Escape.

Set the homepage's social URL and banner metadata in `templates/index.html`
when the final URL and artwork are available. Preserve the original template
attribution and license in the homepage footer.

The inherited fonts, icons, and YouTube embed need internet access.
Media are stored in this project's `static/` folder so it works independently of
`resple_web`.
