// What the home page's hero says about the product, in one place to edit.

/**
 * The proof chips under the buttons. A chip with no value is not rendered, so
 * a number goes in only once it has been measured: leave `startup` out until
 * then, and never put in a figure that has not been checked.
 */
export interface HeroChips {
	memory?: string;
	startup?: string;
	accounts?: string;
}

export const heroChips: HeroChips = {
	// Measured on Windows 11, one window, 30 live connections with schema
	// graphs and workbenches open: about 83 MB more than the app on its own.
	// One run, so it is worded as "under 100". Repeat it before tightening.
	memory: "30 live connections, under 100 MB extra",
	// startup: "Cold start in X s",
	accounts: "0 accounts needed",
};

/** What the chips' figures were measured on, shown small under them. */
export const heroChipsNote = "Measured on Windows 11, with schema graphs and workbenches open.";

/** The databases it works with, as text. */
export const heroEngines: readonly string[] = [
	"SQLite",
	"PostgreSQL",
	"MySQL",
	"MariaDB",
	"SQL Server",
	"Oracle",
];

/** The clip in the app window under the copy. */
export const heroMedia = {
	// The poster is the first frame of the clip: the schema graph.
	poster: "/hero/hero-poster.jpg",
	mp4: "/hero/hero-db.mp4",
	webm: "/hero/hero-db.webm",
	width: 1280,
	height: 720,
	// Read by screen readers in place of the picture.
	description:
		"Forge Super's Database panel: a schema graph of four linked tables, then the rows of a table opened from its right-click menu in the SQL workbench.",
} as const;
