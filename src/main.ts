import { Editor, htmlToMarkdown, MarkdownView, Plugin } from 'obsidian';
import { stripDataUriImagesFromHtml, stripDataUriImagesFromMarkdown } from './utils/dataUri';
import { stripGstaticImagesFromHtml, stripGstaticImagesFromMarkdown } from './utils/gstatic';
import { registerStripNoteCommand } from './commands/stripNote';
import { BlockDataUriSettings, BlockDataUriSettingTab, DEFAULT_SETTINGS } from './settings';

export default class BlockDataUriPlugin extends Plugin {
	settings: BlockDataUriSettings;

	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		this.addSettingTab(new BlockDataUriSettingTab(this.app, this));
		registerStripNoteCommand(this);

		this.registerEvent(
			this.app.workspace.on(
				'editor-paste',
				(evt: ClipboardEvent, editor: Editor, _view: MarkdownView) => {
					this.handlePaste(evt, editor);
				}
			)
		);
	}

	private handlePaste(evt: ClipboardEvent, editor: Editor): void {
		if (!this.settings.stripOnPaste) return;

		// Primary path: HTML clipboard content (e.g. pasting from a web browser).
		// Run all strippers against the HTML, then only intercept if something
		// was actually removed. Obsidian's htmlToMarkdown() converts the cleaned
		// HTML so the rest of the formatting is preserved faithfully.
		const html = evt.clipboardData?.getData('text/html') ?? '';
		if (html) {
			let cleanedHtml = stripDataUriImagesFromHtml(html);
			cleanedHtml = stripGstaticImagesFromHtml(cleanedHtml);
			if (cleanedHtml !== html) {
				evt.preventDefault();
				editor.replaceSelection(htmlToMarkdown(cleanedHtml));
				return;
			}
		}

		// Fallback path: plain text already in Markdown format
		// (e.g. pasting from another Markdown editor).
		const text = evt.clipboardData?.getData('text/plain') ?? '';
		if (text) {
			let cleaned = stripDataUriImagesFromMarkdown(text);
			cleaned = stripGstaticImagesFromMarkdown(cleaned);
			if (cleaned !== text) {
				evt.preventDefault();
				editor.replaceSelection(cleaned);
			}
		}
	}
}
