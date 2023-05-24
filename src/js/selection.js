import { cards } from "./tarotCards.js";

let indexes = [];

let selectedCards = [];

const layout = document.getElementsByClassName("cards-to-select")[0];

/**
 *
 * @returns array of 12 indexes which refer to 12 random cards in the deck
 */
function shuffleDeck() {
	//const indexes = [];
	selectedCards = [];
	indexes = [];
	while (indexes.length < 12) {
		const randomIndex = Math.floor(Math.random() * 78);
		if (!indexes.includes(randomIndex)) {
			//add index to array
			indexes.push(randomIndex);
		}
	}

	layout.innerHTML = "";

	indexes.forEach((elem) => {
		const newFortune = document.createElement("fortune-card");
		newFortune.data = cards.tarot[elem];
		layout.appendChild(newFortune); //
	});

	const layoutChildren = layout.children;
	for (let i = 0; i < 12; i++) {
		const card = layoutChildren[i];
		card.addEventListener("click", function () {
			//check the size of selected
			if (selectedCards.length < 3) {
				selectedCards.push(card);
				if (selectedCards.length == 3) {
					selectedCards.forEach((elem) => {
						console.log(elem);
					});
				}
			} else if (selectedCards.length == 3) {
				alert("you have selected 3 cards already");
			}
		});
	}
	return indexes;
}

//event listener to shuffle cards

const shuffleButton = document.querySelector(".shuffle-layout");
shuffleButton.addEventListener("click", function () {
	//
	shuffleDeck();
});

// listener to catch cards being selectedCards.
const submitSelectionButton = document.querySelector(".submit-selection");
submitSelectionButton.addEventListener("click", function () {
	//check that the selected cards are at least of length 3
	if (selectedCards.length < 3) {
		alert("you do not have 3 cards selected");
		return;
	}

	const fortuneReadingsDisplay = document.querySelector(".display-fortunes");
	const selectionPageElement = document.querySelector("#selection-page");
	const fortunePageElement = document.querySelector("#fortune-page");

	selectionPageElement.remove();
	fortunePageElement.style.visibility = "visible";

	selectedCards.forEach((element) => {
		//const newFortune = document.createElement("fortune-card");
		//newFortune.data = cards.tarot[element];
		fortuneReadingsDisplay.appendChild(element);
	});
	/*
	for (let i = 0; i < selectedCards.length; i = i + 1) {
		const newFortune = document.createElement("fortune-card");
		newFortune.data = cards.tarot[selectedCards[i]];

		fortuneReadingsDisplay.appendChild(newFortune);
	}
  */
});

class fortuneCard extends HTMLElement {
	// Called once when document.createElement('fortune-card') is called, or
	// the element is written into the DOM directly as <recipe-card>
	constructor() {
		super(); // Inheret everything from HTMLElement
		this.attachShadow({ mode: "open" });
		// A2. TODO - Create an <article> element - This will hold our markup once our data is set
		const articleElement = document.createElement("article");
		// A3. TODO - Create a style element - This will hold all of the styles for the Web Component
		const styleElement = document.createElement("style");
		// A4. TODO - Insert all of the styles from cardTemplate.html into the <style> element you just made
		styleElement.textContent = `
      * {
        font-family: sans-serif;
        margin: 0;
        padding: 0px;
        // align-items: center;
        // display: grid;
      }
    
      a {
        text-decoration: none;
      }
    
      a:hover {
        text-decoration: underline;
      }
      // div{
      //   background-color:  aqua;
      // }
    
      article {
        align-items: center;
        border: 1px solid rgb(223, 225, 229);
        border-radius: 8px;
        display: grid;
        grid-template-rows: 118px 56px 14px 18px 15px 36px;
        height: auto;
        row-gap: 5px;
        padding: 0 16px 16px 16px;
        width: 300px;
        background-color: #eed9c4;
        margin: 20px;
        grid-auto-flow: row;
      }
      h3{
        padding-top: 20px;
        // display: inline;
        grid-row-start: 1;


      }

      img{
        height: 200px;
        grid-row-start:2;

      }
      `;
		this.shadowRoot.appendChild(styleElement);
		this.shadowRoot.append(articleElement);
	}

	/**
	 * Called when the .data property is set on this element.
	 *
	 * For Example:
	 * let recipeCard = document.createElement('recipe-card'); // Calls constructor()
	 * recipeCard.data = { foo: 'bar' } // Calls set data({ foo: 'bar' })
	 *
	 * @param {Object} data - The data to pass into the <recipe-card>, must be of the
	 *                        following format:
	 *                        {
	 *                          "imgSrc": "string",
	 *                          "imgAlt": "string",
	 *                          "titleLnk": "string",
	 *                          "titleTxt": "string",
	 *                          "organization": "string",
	 *                          "rating": number,
	 *                          "numRatings": number,
	 *                          "lengthTime": "string",
	 *                          "ingredients": "string"
	 *                        }
	 */
	set data(data) {
		// If nothing was passed in, return
		if (!data) return;
		// console.log("data", data);
		// A6. TODO - Select the <article> we added to the Shadow DOM in the constructor
		const articleDOM = this.shadowRoot.querySelector("article");

		let imageName = data["img"];
		// const imageName = str[0] + numbers

		articleDOM.innerHTML = `
      <div>
      <h3 class="cardName">${data["name"]}</h3>
      <img src = "/src/assets/card-scans/${imageName}">
      
      </div>`;
	}
}
customElements.define("fortune-card", fortuneCard);

window.onload = function () {
	indexes = shuffleDeck();
};
