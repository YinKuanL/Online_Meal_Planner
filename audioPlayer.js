// audioPlayer.js

document.addEventListener('DOMContentLoaded', () => {
    if (!window.audioPlayer) {
        window.audioPlayer = new Audio('/video-audio/science-documentary-169621.mp3');
        window.audioPlayer.loop = true;

        // Set initial volume to 20%
        window.audioPlayer.volume = 0.2;

        // Attempt to autoplay
        const playPromise = window.audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio started automatically');
            }).catch(error => {
                // Autoplay was prevented
                console.log('Autoplay prevented. User interaction required to play audio.', error);
            });
        }
    }

    // Restore the play time for background music
    const savedTime = localStorage.getItem('audioPlayerTime');
    if (savedTime !== null) {
        window.audioPlayer.currentTime = savedTime;
    }
});

// Store the current play time and play page-flip sound when navigating away
window.addEventListener('beforeunload', (event) => {
    if (window.audioPlayer) {
        localStorage.setItem('audioPlayerTime', window.audioPlayer.currentTime);
    }

    try {
        const flipSound = new Audio('/video-audio/page-flip-47177.mp3');
        flipSound.volume = 0.5;
        const playPromise = flipSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Error playing flip sound:', error);
            });
        }
    } catch (error) {
        console.error('Error initializing flip sound:', error);
    }

    // Note: event.returnValue can be added if you want to initiate a dialogue prompt.
});