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
	if (selectedCards.length != 0){
		return;
	}
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
		newBackfaceCard.data = cards.tarot[index];
        newBackfaceCard.classList.add("shuffle"); // Add shuffle animation
        setTimeout(() => {
            newBackfaceCard.classList.remove("shuffle"); // Remove the class after the animation
        }, 500);

        layout.appendChild(newBackfaceCard);
        addCardClickListener(newBackfaceCard);
    });
}

/**
 * sets up an event listener for each fortuneCard
 * If the card was "clicked", then it gets added to our array of selected cards
 * Before we can add, we must check if it was already selected. Or, if 3 cards
 * have already been selected, then the card will not be added. Prompts are shown
 * on screen that indicate these different events
 * @param {HTMLElement} card
 */
let selectSound = document.getElementById("click-select");
function addCardClickListener(card) {
	card.addEventListener("click", function () {
		if (selectedCards.includes(card.index)) {
			alert("This card has already been selected");
			return;
		}
		if (selectedCards.length < 3) {
			selectedCards.push(card.index);
			selectSound.play();
		} else {
			alert("you have selected 3 cards already");
			backfaceCard.goldGlowCount = 3;
		}
	});
}

/**
 * sets up an event listener for the shuffle button, shuffles the dislay on click.
 * Also, once the user clicks the shuffle button, a card shuffling sound will play
 */
let hoverSounds = [
	document.getElementById("hover-sound-1"),
	document.getElementById("hover-sound-2"),
	document.getElementById("hover-sound-3"),
	document.getElementById("hover-sound-4"),
	document.getElementById("hover-sound-5"),
	document.getElementById("hover-sound-6"),
];
document.querySelector(".shuffle-layout").addEventListener("click", () => {
	if (selectedCards.length != 0){
		return;
	}
	shuffleDeck();
	backfaceCard.goldGlowCount = 0;
	let randomSound = hoverSounds[Math.floor(Math.random() * hoverSounds.length)];
	randomSound.play();
});

/**
 * sets up an event listener for the submit button, displays the 3 selected cards
 */
let submitSound = document.getElementById("submit-sound");
document.querySelector(".submit-selection").addEventListener("click", function () {
	if (selectedCards.length < 3) {
		alert("you do not have 3 cards selected");
		return;
	}
	submitSound.play();
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
		this.data = null;
		this.attachShadow({ mode: "open" });
		const styleElement = document.createElement("style");
		styleElement.innerHTML = `
		<style>
			article{
				position = relative;
				width: 250px;
				height: 320px;
			}
			card {
				perspective: 600px;
				position: absolute;
				width: 100%
				height: 100%
				transform-style: preserve-3d;
			}
			front-fortune, back-fortune {
				position: absolute;
  				width: 100%;
  				height: 100%;
				backface-visibility: hidden;
  				transition: transform 0.5s ease-in-out;
			}
			front-fortune{
				transform: rotateY(180deg);
			}
			img {
				position: relative;
				width: 100%;
				height: 100%
			}
			div:hover {
				box-shadow: 0px 0px 10px 5px rgba(128, 0, 128, 0.7); /* Purple glow on hover */
			}
			div.goldGlow {
				box-shadow: 0px 0px 10px 5px rgba(255, 215, 0, 0.7); /* Gold glow after click */
			}
			back-fortune.flipped {
				transform: rotateY(180deg);
			  }  
			front-fortune.flipped {
				transform: rotateY(0);
			}
		</style>`
		this.shadowRoot.appendChild(styleElement);
		const articleElement = document.createElement("article");
		articleElement.innerHTML = `
		<div id="card-container">
			<div id="card">
				<div id ="card-back" class = "back-fortune">
					<img id = "backImage" src = "./assets/card-scans/backface-card.jpg">
				</div>
			</div>
		</div>`
		this.shadowRoot.append(articleElement);
	}
	connectedCallback() {
		// Add event listener for the click
		this.shadowRoot.querySelector("#card").addEventListener("click", () => {
			if (!this._glowing && backfaceCard.goldGlowCount < backfaceCard.maxGoldGlow) {
				this.shadowRoot.querySelector("#card").classList.add("goldGlow");
				this._glowing = true; // Update instance variable
				backfaceCard.goldGlowCount++; // Increase count
				console.log(this.shadowRoot.querySelector("#card-front"))
				console.log(this.shadowRoot.querySelector("#card-back"))
				this.shadowRoot.querySelector("#card-front").classList.toggle('flipped');
				this.shadowRoot.querySelector("#card-back").classList.toggle('flipped');
			}
		});
	}
	get index() {
		return this._index;
	}

	set index(index) {
		this._index = index;

	}

	set data(data){
		// If nothing was passed in, return
		if (!data) return;
		const articleDOM = this.shadowRoot.querySelector("article");
		console.log(articleDOM.querySelector("#card-container"))
		articleDOM.querySelector("#card").innerHTML += `
		<div id ="card-front" class = "front-fortune">
			<img id = "frontImage" src = "./assets/card-scans/${data.img}">
		</div>`;
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
			// height: 100%;
			
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
