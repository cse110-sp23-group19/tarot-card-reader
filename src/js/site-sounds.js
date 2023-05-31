let music = document.getElementById("bg-music");
const playButton = document.getElementById("mute-button");

// Function to get the music muted state from localStorage
function getMusicMutedState() {
	try {
		return localStorage.getItem("musicMuted");
	} catch (error) {
		// localStorage is not available, return a default value
		return null;
	}
}

// Check localStorage to see if the music was playing previously
if (getMusicMutedState() === "true") {
	music.muted = true;
}

function toggleMusic() {
	if (music.muted) {
		music.muted = false;
		//set time from local storage
		music.currentTime = parseInt(localStorage.getItem("time"));
		setMusicMutedState("false");
	} else {
		music.muted = true;
		//set time in local storage
		localStorage.setItem("time", music.currentTime.toString());
		setMusicMutedState("true");
	}
}

// Function to set the music muted state in localStorage
function setMusicMutedState(value) {
	try {
		localStorage.setItem("musicMuted", value);
	} catch (error) {
		// localStorage is not available, can't store the value
		console.error("Failed to save state in localStorage:", error);
	}
}

playButton.addEventListener("click", () => {
	toggleMusic();
});

window.onload = (event) => {
	music = document.getElementById("bg-music");
	//set music time to what is in local storate
	music.currentTime = parseInt(localStorage.getItem("time"));
};
