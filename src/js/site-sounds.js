// Retrieve the HTML element for the background music
let music = document.getElementById("bg-music");
// Retrieve the HTML element for the mute button
const playButton = document.getElementById("mute-button");

// Function to get the music muted state from localStorage
function getMusicMutedState() {
	try {
		// Return the music muted state from localStorage
		return localStorage.getItem("musicMuted");
	} catch (error) {
		// localStorage is not available, return a default value
		return null;
	}
}

// Check localStorage to see if the music was playing previously
// Check localStorage to see if the music was muted previously
// If it was, then mute the music on page load
if (getMusicMutedState() === "true") {
	music.muted = true;
}

// Function to toggle the state of the music (either mute or unmute)
function toggleMusic() {
	if (music.muted) {
		// If music is muted, unmute and reset the time from local storage
		music.muted = false;
		//set time from local storage
		music.currentTime = parseInt(localStorage.getItem("time"));
		// Save the unmuted state to localStorage
		setMusicMutedState("false");
	} else {
		// If music is not muted, mute it and save the current time to local storage
		music.muted = true;
		//set time in local storage
		localStorage.setItem("time", music.currentTime.toString());
		// Save the muted state to localStorage
		setMusicMutedState("true");
	}
}

// Function to set the music muted state in localStorage
function setMusicMutedState(value) {
	try {
		// Set the music muted state in localStorage
		localStorage.setItem("musicMuted", value);
	} catch (error) {
		// localStorage is not available, can't store the value
		console.error("Failed to save state in localStorage:", error);
	}
}

// Add an event listener to the mute button that will toggle the music state when clicked

playButton.addEventListener("click", () => {
	toggleMusic();
});

// Set the initial state of the music when the window loads

window.onload = () => {
	music = document.getElementById("bg-music");
	//set music time to what is in local storate
	music.currentTime = parseInt(localStorage.getItem("time"));
};
