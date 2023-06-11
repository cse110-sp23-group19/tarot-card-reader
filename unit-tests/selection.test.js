const functions = require("../src/js/selection.js");

test("shuffling the deck only selects 12 cards, 1000 times", () => {
    for(let i = 0; i < 1000; i++){
        expect(functions.shuffleDeck().length).toBe(12);
    }
});

test("shuffling the deck only selects cards with index less than 78, 1000 times", () => {
    for(let i = 0; i < 1000; i++){
        let deck = functions.shuffleDeck();
        for(let j = 0; j < deck.length; j++){
            expect(deck[j]).toBeLessThan(78);
        }
    }
});

test("all cards in deck are unique, 1000 times", () => {
    for(let i = 0; i < 1000; i++){
        let deck = functions.shuffleDeck();
        const allUnique = deck => deck.length === new Set(deck).size;
        expect(allUnique(deck)).toBe(true);
    }
});