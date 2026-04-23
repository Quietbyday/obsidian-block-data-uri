# Block Data URI

An [Obsidian](https://obsidian.md) plugin that automatically strips unwanted image links from pasted text and from notes on demand.

## What it does

This plugin keeps unwanted images out of your notes in two ways:

**On paste** — when you paste text into an Obsidian note, the plugin checks the clipboard for blocked images and removes them before the text is inserted. Everything else — plain text, regular image links, other Markdown — is left untouched.

**On demand** — run the command **Strip blocked images from note** (via the command palette) to scan the entire active note and remove any blocked image links already present.

## Blocked image types

| Type | Example |
|---|---|
| Data URI images | `![](data:image/png;base64,iVBORw0KGgoAAAANS...)` |
| Google static images (`gstatic.com`) | `![label](https://encrypted-tbn0.gstatic.com/...)` |

In both cases, any text that immediately follows the image link on the same line is also removed (for example, auto-generated labels like `Google for Developers +3` appended by some web apps).

## Why this is useful

Web browsers, word processors, and other tools sometimes embed images as base64-encoded data URIs or reference tracking/favicon images from `gstatic.com`. Pasting content from these sources into Obsidian can leave large blobs of encoded data or unwanted image references in your notes. This plugin silently discards them so your notes stay clean.

## Paste behaviour

| Pasted content | What gets inserted |
|---|---|
| `![](data:image/png;base64,abc...) label` | *(nothing — image and trailing label removed)* |
| `Some text ![](data:image/png;base64,abc...) more text` | `Some text ` |
| `![label](https://encrypted-tbn0.gstatic.com/...) label` | *(nothing)* |
| `![photo](https://example.com/img.png)` | `![photo](https://example.com/img.png)` (unchanged) |
| Any text with no blocked images | Inserted exactly as pasted |

The plugin handles all image subtypes (`png`, `jpeg`, `gif`, `webp`, `svg+xml`, etc.) and strips multiple occurrences in a single paste.

## Settings

Open **Settings → Community plugins → Block Data URI** to access the plugin options.

| Setting | Default | Description |
|---|---|---|
| Strip blocked images on paste | On | When enabled, blocked images are removed automatically as you paste. Turn this off to paste without interference and strip images manually via the command palette. |

## Commands

| Command | Description |
|---|---|
| **Strip blocked images from note** | Removes all blocked image links from the entire active note. Shows a notice confirming the result, or that none were found. |

## Installation

1. Build the plugin (see below) or download a release.
2. Copy `main.js` and `manifest.json` to your vault at:
   ```
   <Vault>/.obsidian/plugins/block-data-uri/
   ```
3. Reload Obsidian and enable **Block Data URI** under **Settings → Community plugins**.

## Building from source

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
npm install
npm run build
```

This produces `main.js` at the project root.

## Changelog

### 0.1.3-beta

- Added blocking of `gstatic.com` image links (e.g. Google favicon/thumbnail images embedded by web apps).
- Trailing text that immediately follows a blocked image link on the same line is now also removed (for example, auto-generated labels appended after the image).
- Renamed command from "Strip data URI images from note" to "Strip blocked images from note" to reflect the broader scope. The command ID is unchanged, so existing keyboard shortcuts are not affected.

### 0.1.2-beta

- Added settings panel (**Settings → Community plugins → Block Data URI**) with a toggle to enable or disable automatic stripping on paste. The command palette command always runs regardless of this setting.

### 0.1.1-beta

- Fixed paste interception for content copied from web browsers. Previously the plugin only inspected `text/plain` clipboard data, but browsers place formatted content on the clipboard as `text/html`, which Obsidian converts to Markdown on paste. The plugin now intercepts `text/html` first, strips data URI `<img>` elements using DOM methods, and converts the cleaned HTML to Markdown using Obsidian's own `htmlToMarkdown()` function. The plain-text path is retained as a fallback.
- Added command: **Strip blocked images from note** — scans the entire active note and removes all blocked image links.

### 0.1.0-beta

- Initial release: strips data URI image links from pasted plain text / Markdown.
