export type DocSection = {
	/** The step number for a `## N. Title` section, 0 for the text before the first section, null for any other section. */
	step: number | null;
	markdown: string;
};

/**
 * Splits a docs page into its `## ` sections, so media can be placed after the
 * step it belongs to. A section whose heading starts with a number and a dot
 * (`## 3. Add a Delay step`) is step 3; the text before the first heading is
 * step 0; other sections (`## Where next`) have no step. Headings inside a code
 * fence are not headings.
 */
export function splitSections(markdown: string): DocSection[] {
	const sections: DocSection[] = [];
	let lines: string[] = [];
	let step: number | null = 0;
	let inFence = false;

	const flush = () => {
		const text = lines.join("\n").trim();
		if (text) sections.push({ step, markdown: text });
		lines = [];
	};

	for (const line of markdown.split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
		if (!inFence && line.startsWith("## ")) {
			flush();
			const numbered = /^##\s+(\d+)\./.exec(line);
			step = numbered ? Number(numbered[1]) : null;
		}
		lines.push(line);
	}
	flush();
	return sections;
}
