const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { shuffleDeck, displayShuffledCards, addCardClickListener } =
	require("../src/js/selection").default.default; // assuming you have exported these functions

describe("tarot card fortune telling tests", () => {
	beforeAll(() => {
		// Setup a JSDOM document to be used for testing
		const dom = new JSDOM();
		global.document = dom.window.document;
		global.window = dom.window;
	});

	test("shuffleDeck should generate 12 unique indexes", () => {
		shuffleDeck();
		const indexSet = new Set(indexes);
		expect(indexSet.size).toEqual(12);
	});

	test("displayShuffledCards should add 12 cards to the layout", () => {
		displayShuffledCards();
		expect(layout.childNodes.length).toEqual(12);
	});
});
