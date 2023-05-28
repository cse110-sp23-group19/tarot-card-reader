import { cards } from "./tarotCards.js";

/**
 * An array of indices referencing the shuffled cards displayed on screen
 * @type {number[]}
 */
let indexes = [];

/**
 * An array of selected fortuneCard elements
 * @type {HTMLElement[]}
 */
let selectedCards = [];

const layout = document.getElementsByClassName("cards-to-select")[0];

/**
 * Shuffles the deck and displays 12 cards for selection
 */
function shuffleDeck() {
	selectedCards = [];
	indexes = [];
	while (indexes.length < 12) {
		const randomIndex = Math.floor(Math.random() * 78);
		if (!indexes.includes(randomIndex)) {
			indexes.push(randomIndex);
		}
	}
	layout.innerHTML = "";
	displayShuffledCards();
}

/**
 * displays each of the 12 shuffled cards to the display
 */
function displayShuffledCards() {
	indexes.forEach((index) => {
		const newBackfaceCard = document.createElement("backface-card");
		newBackfaceCard.index = index;

		layout.appendChild(newBackfaceCard);
		addCardClickListener(newBackfaceCard);
	});
}

/**
 * sets up an event listener for each fortuneCard
 * @param {HTMLElement} card
 */
function addCardClickListener(card) {
	card.addEventListener("click", function () {
		if (selectedCards.includes(card.index)) {
			alert("This card has already been selected");
			return;
		}
		if (selectedCards.length < 3) {
			selectedCards.push(card.index);
			if (selectedCards.length === 3) {
				selectedCards.forEach((elem) => {
					console.log(elem);
				});
			}
		} else {
			alert("you have selected 3 cards already");
		}
	});
}

/**
 * sets up an event listener for the shuffle button, shuffles the dislay on click
 */
document.querySelector(".shuffle-layout").addEventListener("click", () => {
	shuffleDeck();
	backfaceCard.goldGlowCount = 0;
});

/**
 * sets up an event listener for the submit button, displays the 3 selected cards
 */
document.querySelector(".submit-selection").addEventListener("click", function () {
	if (selectedCards.length < 3) {
		alert("you do not have 3 cards selected");
		return;
	}
	displayFortunePage();
});

/**
 * removes the selection page, and makes the selected cards visible to user
 */
function displayFortunePage() {
	const fortuneReadingsDisplay = document.querySelector(".display-fortunes");
	const selectionPageElement = document.querySelector("#selection-page");
	const fortunePageElement = document.querySelector("#fortune-page");

	selectionPageElement.remove();
	fortunePageElement.style.visibility = "visible";

	selectedCards.forEach((cardIndex) => {
		const newCard = document.createElement("fortune-card");
		newCard.data = cards.tarot[cardIndex];
		fortuneReadingsDisplay.appendChild(newCard);
	});
}
/**
 * A class to represent the back of the cards
 */
class backfaceCard extends HTMLElement {
	static goldGlowCount = 0;
	static maxGoldGlow = 3;

	constructor() {
		super();
		this._index = null;
		this._glowing = false;
		this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.shadowRoot.innerHTML = `
		<style>
			div {
				width: 200px;
				height: 300px;
			}
			img {
				width: 100%;
				height: 100%
			}
			div:hover {
				box-shadow: 0px 0px 10px 5px rgba(128, 0, 128, 0.7); /* Purple glow on hover */
			}
			div.goldGlow {
				box-shadow: 0px 0px 10px 5px rgba(255, 215, 0, 0.7); /* Gold glow after click */
			}
		</style>
		<div id="card">
			<img src = "/src/assets/card-scans/backface-card.jpg">
		</div>`;

		// Add event listener for the click
		this.shadowRoot.querySelector("#card").addEventListener("click", () => {
			if (!this._glowing && backfaceCard.goldGlowCount < backfaceCard.maxGoldGlow) {
				this.shadowRoot.querySelector("#card").classList.add("goldGlow");
				this._glowing = true; // Update instance variable
				backfaceCard.goldGlowCount++; // Increase count
			}
		});
	}
	get index() {
		return this._index;
	}

	set index(index) {
		this._index = index;
	}
}

/**
 * Fortune card custom HTML element
 */
class fortuneCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		const articleElement = document.createElement("article");
		const styleElement = document.createElement("style");
		styleElement.textContent = `
      	* {
			font-family: sans-serif;
			margin: 0;
			padding: 0px;

		}
    
		a {
			text-decoration: none;
		}
		
		a:hover {
			text-decoration: underline;
		}
		div {
			display:grid;
			background-color: black;
			border: 1px solid rgb(223, 225, 229);
			border-radius: 8px;
			padding: 0px 16px 16px 16px;
			
		}
		.card-title{

			font-size: 25px;
			padding: 10px 0px 10px 0px;
			font-family: "Nanum Myeongjo";
		}
		p{
			font-family: "Nanum Myeongjo";
		}

		
		article {
			align-items: center;
			border: 1px solid rgb(223, 225, 229);
			border-radius: 8px;
			border-color: black;
			grid-template-rows: 118px 56px 14px 18px 15px 36px;
			height: auto;
			row-gap: 5px;
			padding: 16px 16px 16px 16px;
			width: 350px;
			background-color: black;
			margin: 20px;
			grid-auto-flow: row;
			box-shadow:  0 0 0 2px rgb(255, 255, 255),
			0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
		}
		
		h3{
			padding-top: 20px;
			grid-row-start: 1;
			


		}

		img{
			height: 400px;
			grid-row-start:2;
			margin: auto;

		}
		`;
		this.shadowRoot.appendChild(styleElement);
		this.shadowRoot.append(articleElement);
	}

	/**
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
		const articleDOM = this.shadowRoot.querySelector("article");

		let imageName = data["img"];

		articleDOM.innerHTML = `
      <div>

      <h3 class="card-title">${data["name"]}</h3>
	  <br><br>
      <img src = "./assets/card-scans/${imageName}">
	  <p> Your interpretation: </p>
	  <p>${data["interpretation"]} </p>
      </div>`;
	}
}

customElements.define("backface-card", backfaceCard);
customElements.define("fortune-card", fortuneCard);

/**
 * Calls shuffleDeck on window load in order to setup the initial layout
 */
window.onload = shuffleDeck();
