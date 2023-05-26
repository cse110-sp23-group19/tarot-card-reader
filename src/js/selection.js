import { cards } from "./tarotCards.js";

/**
 *
 * @returns array of 8 indexes which refer to 8 random cards in the deck
 */
function shuffleDeck() {
	const indexes = [];
	while (indexes.length < 3) {
		const randomIndex = Math.floor(Math.random() * 78);
		if (!indexes.includes(randomIndex)) {
			//add index to array
			indexes.push(randomIndex);
		}
	}
	return indexes;
}

// listener to catch cards being selectedCards.
const submitSelectionButton = document.querySelector(".submit-selection");
submitSelectionButton.addEventListener("click", function () {
	const selectedCards = shuffleDeck();
	const fortuneReadingsDisplay = document.querySelector(".display-fortunes");
	const selectionPageElement = document.querySelector("#selection-page");
	const fortunePageElement = document.querySelector("#fortune-page");

	selectionPageElement.remove();
	fortunePageElement.style.visibility = "visible";

	selectedCards.forEach((element) => {
		const newFortune = document.createElement("fortune-card");
		newFortune.data = cards.tarot[element];
		fortuneReadingsDisplay.appendChild(newFortune);
	});

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
      <img src = "/src/assets/card-scans/${imageName}">
	  <p> Your interpretation: </p>
	  <p>${data["interpretation"]} </p>


      </div>`;
	}
}
customElements.define("fortune-card", fortuneCard);
