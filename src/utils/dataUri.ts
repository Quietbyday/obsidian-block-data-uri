import { removeTrailingContent } from './dom';

/**
 * Matches Markdown image links whose source is a data URI, plus any
 * trailing text on the same line.
 * Used when clipboard content is plain text / Markdown.
 *
 * Examples matched (link + trailing text removed together):
 *   ![](data:image/png;base64,abc123==)
 *   ![alt text](data:image/jpeg;base64,/9j/...) some label text
 *
 * Examples NOT matched:
 *   ![photo](https://example.com/img.png)
 *   [link](data:image/png;base64,abc123==)   ← not an image (no leading !)
 */
const DATA_URI_IMAGE_MD_REGEX = /!\[.*?\]\(data:image\/[^)]+\)[^\n]*/g;

/**
 * Returns true if the plain-text/Markdown content contains at least one
 * data URI image link in Markdown syntax.
 */
export function containsDataUriImageInMarkdown(text: string): boolean {
	DATA_URI_IMAGE_MD_REGEX.lastIndex = 0;
	return DATA_URI_IMAGE_MD_REGEX.test(text);
}

/**
 * Returns the text with all Markdown data URI image links removed,
 * along with any trailing text that follows each link on the same line.
 */
export function stripDataUriImagesFromMarkdown(text: string): string {
	DATA_URI_IMAGE_MD_REGEX.lastIndex = 0;
	return text.replace(DATA_URI_IMAGE_MD_REGEX, '');
}

/**
 * Returns true if the HTML string contains at least one <img> element
 * whose src attribute is a data URI.
 */
export function containsDataUriImageInHtml(html: string): boolean {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div.querySelector('img[src^="data:image/"]') !== null;
}

/**
 * Returns the HTML string with all <img> elements whose src is a data URI
 * removed, along with any trailing inline content on the same line.
 */
export function stripDataUriImagesFromHtml(html: string): string {
	const div = document.createElement('div');
	div.innerHTML = html;
	div.querySelectorAll('img[src^="data:image/"]').forEach(img => {
		removeTrailingContent(img);
		img.remove();
	});
	return div.innerHTML;
}
