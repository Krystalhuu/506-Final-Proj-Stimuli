POWER BANK STUDY — COLLABORATOR SOURCE PACKAGE
Snapshot: September 29, 2026; source corresponds to published version 7.

FILES
index.html — mobile product page, researcher editor, and CSS.
app.js — default copy, editable fields, explanation toggle, preview and configuration handling.
powerbank.png — product image.
COLLABORATOR_PROMPT.txt — paste into ChatGPT with this ZIP and your requested edits.

QUICK START
Upload this ZIP to ChatGPT, then paste COLLABORATOR_PROMPT.txt with your edits filled in. If ZIP extraction is unavailable, unzip on your computer and attach the individual files.
For local viewing, keep the three website files together and open index.html in a browser. For a local server, run python3 -m http.server 8000 in that folder and open http://localhost:8000.
This is plain HTML/CSS/JavaScript. No build step or packages are required. Publish the folder containing index.html as a static site if publishing is supported.

EDITING AND SHARING
The seven editor text fields are retailer, brand, product name, price, recommendation label, recommendation note, and explanation. Show explanation controls visibility. The participant link embeds the configuration in its URL fragment. Download/load configuration saves and restores a JSON configuration; this does not change the source defaults. To change defaults, edit app.js.
This package creates an independent copy. Original project identifiers, repository history, and hosting configuration have been excluded. Changes to a collaborator copy do not update Jess's site.

IMPLEMENTATION NOTES FOR CHATGPT
The explanation output id is productExplanation; the editor textarea id is explanation. Keep them distinct (a prior duplicate-id bug prevented the toggle from working).
Product details and Color: Graphite remain in the HTML but are removed by app.js at runtime. Preserve their absence in the rendered page.
Some researcher labels are hard-coded to AI even though the source text is editable. Adjust those labels if requested when building other source conditions.
Participant tabs on the same origin receive live editor updates through BroadcastChannel/localStorage. This is for researcher preview; multiple conditions open in the same browser can overwrite each other's preview state. Review or isolate this behavior before using the site for participant data collection.
The site collects no responses or purchases; Add to cart only displays a preview message. Product and retailer are fictional.
