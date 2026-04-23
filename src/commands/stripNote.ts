import { Editor, Notice, Plugin } from 'obsidian';
import { stripDataUriImagesFromMarkdown } from '../utils/dataUri';
import { stripGstaticImagesFromMarkdown } from '../utils/gstatic';

/**
 * Registers the "Strip blocked images from note" command.
 *
 * When run, the command scans the entire content of the active note and
 * removes all blocked Markdown image links (data URI images and gstatic.com
 * images). A notice is shown to confirm the result.
 */
export function registerStripNoteCommand(plugin: Plugin): void {
	plugin.addCommand({
		id: 'strip-data-uri-images-from-note',
		name: 'Strip blocked images from note',
		editorCallback: (editor: Editor) => {
			const original = editor.getValue();

			let cleaned = stripDataUriImagesFromMarkdown(original);
			cleaned = stripGstaticImagesFromMarkdown(cleaned);

			if (cleaned === original) {
				new Notice('Block Data URI: no blocked images found in this note.');
				return;
			}

			editor.setValue(cleaned);
			new Notice('Block Data URI: blocked images removed.');
		},
	});
}
