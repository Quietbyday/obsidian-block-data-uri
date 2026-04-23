import { removeTrailingContent } from './dom';

/**
 * Matches Markdown image links whose URL contains gstatic.com, plus any
 * trailing text on the same line.
 * Used when clipboard content is plain text / Markdown.
 *
 * Examples matched (link + trailing text removed together):
 *   ![Reddit](https://encrypted-tbn2.gstatic.com/faviconV2?url=...) Reddit
 *   ![Google](https://encrypted-tbn0.gstatic.com/faviconV2?url=...) Google +3
 *
 * Examples NOT matched:
 *   ![photo](https://example.com/img.png)
 */
const GSTATIC_IMAGE_MD_REGEX = /!\[.*?\]\(https?:\/\/[^)]*gstatic\.com[^)]*\)[^\n]*/g;

/**
 * Returns the text with all Markdown gstatic.com image links removed,
 * along with any trailing text that follows each link on the same line.
 */
export function stripGstaticImagesFromMarkdown(text: string): string {
	GSTATIC_IMAGE_MD_REGEX.lastIndex = 0;
	return text.replace(GSTATIC_IMAGE_MD_REGEX, '');
}

/**
 * Returns the HTML string with all <img> elements whose src points to
 * gstatic.com removed, along with any trailing inline content on the same line.
 */
export function stripGstaticImagesFromHtml(html: string): string {
	const div = document.createElement('div');
	div.innerHTML = html;
	div.querySelectorAll('img[src*="gstatic.com"]').forEach(img => {
		removeTrailingContent(img);
		img.remove();
	});
	return div.innerHTML;
}
