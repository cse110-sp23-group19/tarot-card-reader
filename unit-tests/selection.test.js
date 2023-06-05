const functions = require("../src/js/selection.js");

test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
});

test("shuffling the deck only selects 12 cards, 100 times", () => {
    for(let i = 0; i < 100; i++){
        expect(functions.shuffleDeck().length).toBe(12);
    }
});