/**
 * Import Tarot Card data using fetch
 */
 let cards = "";
 fetch("./js/tarotCards.json")
	.then(response => response.json())
	.then(json => cards = json);


/**
 * This conditional checks if the code is running in a Node.js environment (common for testing)
 * If it is, it exports the 'shuffleDeck' function for use in testing
 */
if (typeof module === "object") {
	module.exports = { shuffleDeck };
}

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
 * Brings the user back to the shuffle cards page to give them a new reading if they choose to
 */
document.getElementById("get-new-reading").addEventListener("click", () => {
	// remove fortune cards from fortune-page
	let fortunes = document.getElementsByClassName("display-fortunes")[0];
	fortunes.innerHTML = "";
	// bring user back to card selection page
	document.getElementById("fortune-page").classList = "hidden";
	document.getElementById("selection-page").classList = "visible";
	// reset the selection page states
	resetSelectionPageStates();
});

/**
 * Resets the states of the selection page. This means no cards have been
 * selected and the user is able to shuffle the deck
 */
function resetSelectionPageStates() {
	backfaceCard.goldGlowCount = 0;
	selectedCards = [];
	shuffleDeck();
}

/**
 * This button resets the fortunes page, removing any current fortunes
 * and return the user to the card selection page 
 * It also resets the card selection page by calling the 'resetSelectionPageStates' function
 */
const removeButton = document.getElementById("remove");
if (removeButton) {
	removeButton.onclick = function () {
		// bring user to the selection page, remove the landing page
		document.getElementById("landing-page").remove();
		document.getElementById("selection-page").classList = "visible";
		// initialize the selection page
		resetSelectionPageStates();
	};
}

/**
 * Shuffles the deck and displays 12 cards for selection
 * The shuffling operation only proceeds if no cards have been selected 
 */
function shuffleDeck() {
	// cannot shuffle if user has already selected a card
	if (selectedCards.length != 0) {
		return;
	}
	selectedCards = [];
	indexes = [];
	// displays the shuffle button on reset
	document.querySelector(".shuffle-layout").style.visibility= "visible";
	// randomize the cards
	while (indexes.length < 12) {
		const randomIndex = Math.floor(Math.random() * 78);
		if (!indexes.includes(randomIndex)) {
			indexes.push(randomIndex);
		}
	}
	if (layout) layout.innerHTML = "";
	displayShuffledCards();
	return indexes;
}

/**
 * Creates and displays each of the 12 shuffled cards to the display
 */
function displayShuffledCards() {
	// for each of the 12 cards set the back card image, index, and add shuffle animation
	indexes.forEach((index) => {
		const newBackfaceCard = document.createElement("backface-card");
		newBackfaceCard.index = index;
		newBackfaceCard.classList.add("shuffle"); 
		// remove the class after the animation
		setTimeout(() => {
			newBackfaceCard.classList.remove("shuffle"); 
		}, 500);

		if (layout) layout.appendChild(newBackfaceCard);
		addCardClickListener(newBackfaceCard);
	});
}

/**
 * Sets up an event listener for each fortuneCard
 * If the card was "clicked", then it gets added to our array of selected cards
 * @param {HTMLElement} card card to add event listener to
 */
let selectSound = document.getElementById("click-select");
function addCardClickListener(card) {
	card.addEventListener("click", function () {
		// warn the user if card has already been selected
		if (selectedCards.includes(card.index)) {
			alert("This card has already been selected");
			return;
		}
		// user selects new card, has not chosen 3 cards yet 
		if (selectedCards.length < 3) {
			selectedCards.push(card.index);
			selectSound.play();
			// hide shuffle button
			document.querySelector(".shuffle-layout").style.visibility= "hidden";
		// user has already chosen 3 cards, warn user
		} else {
			alert("you have selected 3 cards already");
			backfaceCard.goldGlowCount = 3;
		}
	});
}

/**
 * Sets up an event listener for the shuffle button, shuffles the dislay on click
 * Once the user clicks the shuffle button, a card shuffling sound will play
 */
let hoverSounds = [
	document.getElementById("hover-sound-1"),
	document.getElementById("hover-sound-2"),
	document.getElementById("hover-sound-3"),
	document.getElementById("hover-sound-4"),
	document.getElementById("hover-sound-5"),
	document.getElementById("hover-sound-6"),
];

/**
 * Sets up the shuffle button functionality
 * The button is only available if the user has not selected any cards.
 */
const shuffleButton = document.querySelector(".shuffle-layout");
if (shuffleButton) {
	shuffleButton.addEventListener("click", () => {
		if (selectedCards.length != 0) {
			return;
		}
		shuffleDeck();
		backfaceCard.goldGlowCount = 0;
		let randomSound = hoverSounds[Math.floor(Math.random() * hoverSounds.length)];
		randomSound.play();
	});
}

/**
 * Sets up an event listener for the submit button, displays the 3 selected cards
 * The 'submitButton' element, when clicked, checks if 3 cards have been selected
 */
let submitSound = document.getElementById("submit-sound");
const submitButton = document.querySelector(".submit-selection");
if (submitButton) {
	submitButton.addEventListener("click", function () {
		// if less than 3 cards have been selected, give an alert message
		if (selectedCards.length < 3) {
			alert("you do not have 3 cards selected");
			return;
		}
		// 3 cards have been selected, play a sound and display the fortunes page
		submitSound.play();
		displayFortunePage();
	});
}

/**
 * Removes the selection page, makes the selected cards visible to user
 * and displays the selected cards on the fortunes page
 */
function displayFortunePage() {
	const fortuneReadingsDisplay = document.querySelector(".display-fortunes");
	const selectionPageElement = document.querySelector("#selection-page");
	const fortunePageElement = document.querySelector("#fortune-page");
	// switch from selection page to display fortune page
	selectionPageElement.classList = "hidden";
	fortunePageElement.style.visibility = "visible";
	fortunePageElement.classList = "visible";
	// for each of the selected cards, set the card info to 
	// the card details in tarotCard.js
	selectedCards.forEach((cardIndex) => {
		const newCard = document.createElement("fortune-card");
		newCard.data = cards.tarot[cardIndex];
		fortuneReadingsDisplay.appendChild(newCard);
	});
}
/**
 * Back of fortune card custom HTML element for selection page
 */
class backfaceCard extends HTMLElement {
	static goldGlowCount = 0;
	static maxGoldGlow = 3;
	/**
	 * Constructor for class backfaceCard
	 */
	constructor() {
		super();
		this._index = null;
		this._glowing = false;
		this.attachShadow({ mode: "open" });
	}
	/**
	 * connectedCallback() is called anytime
	 * the backfaceCard element is added to the
	 * document
	 */
	connectedCallback() {
		// set the css styling of the fortunes to select
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
			<img src = "./assets/card-scans/backface-card.jpg">
		</div>`;

		// add event listener if a card is selected
		this.shadowRoot.querySelector("#card").addEventListener("click", () => {
			if (!this._glowing && backfaceCard.goldGlowCount < backfaceCard.maxGoldGlow) {
				this.shadowRoot.querySelector("#card").classList.add("goldGlow");
				this._glowing = true; 
				backfaceCard.goldGlowCount++; 
			}
		});
	}
	/**
	 * returns the index of the backfaceCard
	 */
	get index() {
		return this._index;
	}
	/**
	 * sets the index of the backfaceCard
	 * @param {Number} index number to set index to
	 */
	set index(index) {
		this._index = index;
	}
}

/**
 * Fortune card custom HTML element for display page
 */
class fortuneCard extends HTMLElement {
	/**
	 * Constructor for class fortuneCard
	 */
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
			min-height: 700px; /* Set a minimum height for the container */

			
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
	 * Matches the selected cards to the card image, name, and meaning
	 * @param {Object} data index from the "tarot" array in the tarotCards.json file
	 */
	set data(data) {
		// if nothing was passed in, return
		if (!data) return;
		const articleDOM = this.shadowRoot.querySelector("article");
		let imageName = data["img"];
		articleDOM.innerHTML = `
    	<div class="fortune-card-container">
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

