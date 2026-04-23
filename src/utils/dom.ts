/**
 * Block-level HTML tags that mark the boundary of a "line" in the DOM.
 * Traversal stops when one of these is encountered as a sibling.
 */
const BLOCK_TAGS = new Set([
	'p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'li', 'ul', 'ol', 'blockquote', 'pre',
	'table', 'tr', 'td', 'th',
	'section', 'article', 'header', 'footer', 'main', 'aside',
]);

/**
 * Removes all sibling nodes that follow `el` on the same "line" — that is,
 * text nodes and inline elements up to (but not including) the next block-level
 * element or <br>.
 *
 * Call this *before* removing `el` itself so that sibling references are
 * still intact.
 */
export function removeTrailingContent(el: Element): void {
	let node = el.nextSibling;
	while (node) {
		const next = node.nextSibling;
		if (node.nodeType === Node.ELEMENT_NODE) {
			const tag = (node as Element).tagName.toLowerCase();
			if (tag === 'br' || BLOCK_TAGS.has(tag)) break;
			node.remove();
		} else if (node.nodeType === Node.TEXT_NODE) {
			node.remove();
		}
		node = next;
	}
}
