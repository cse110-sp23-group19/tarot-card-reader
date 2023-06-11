// retrieve the HTML element for the background music
let music = document.getElementById("bg-music");
// retrieve the HTML element for the mute button
const playButton = document.getElementById("mute-button");

/**
 * Function to get the music muted state from localStorage
 */
function getMusicMutedState() {
	try {
		// return the music muted state from localStorage
		return localStorage.getItem("musicMuted");
	} catch (error) {
		// localStorage is not available, return a default value
		return null;
	}
}

// check if music has been muted
if (getMusicMutedState() === "true") {
	music.muted = true;
}

/**
 * Function to toggle the state of the music (either mute or unmute)
 */
function toggleMusic() {
	if (music.muted) {
		// if music is muted, unmute and reset the time from local storage
		music.muted = false;
		music.currentTime = parseInt(localStorage.getItem("time"));
		setMusicMutedState("false");
	} else {
		// if music is not muted, mute it and save the current time to local storage
		music.muted = true;
		localStorage.setItem("time", music.currentTime.toString());
		setMusicMutedState("true");
	}
}

/**
 * Function to set the music muted state in localStorage
 * @param {*} value 
 */
function setMusicMutedState(value) {
	try {
		// set the music muted state in localStorage
		localStorage.setItem("musicMuted", value);
	} catch (error) {
		// localStorage is not available, can't store the value
		console.error("Failed to save state in localStorage:", error);
	}
}

// add an event listener to the mute button that will toggle the music state when clicked
playButton.addEventListener("click", () => {
	toggleMusic();
});

// set the initial state of the music when the window loads
window.onload = () => {
	music = document.getElementById("bg-music");
	// set music time to what is in local storate
	music.currentTime = parseInt(localStorage.getItem("time"));
};
