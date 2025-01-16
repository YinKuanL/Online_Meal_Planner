/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
global.$ = $;

describe('audioPlayer.js', () => {
    let audioPlayerMock;

    beforeEach(() => {
        // Set up the DOM
        document.body.innerHTML = `
            <audio id="audio-player"></audio>
        `;

        // Mock the Audio constructor
        audioPlayerMock = {
            play: jest.fn(),
            pause: jest.fn(),
            currentTime: 0,
            loop: false,
            volume: 0,
        };
        global.Audio = jest.fn(() => audioPlayerMock);

        // Mock localStorage methods
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };

        // Load the script
        require('../audioPlayer');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize audio player and attempt autoplay', async () => {
        // Simulate the DOMContentLoaded event
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Check if Audio is created with the correct path
        expect(global.Audio).toHaveBeenCalledWith('/video-audio/science-documentary-169621.mp3');
        expect(audioPlayerMock.loop).toBe(true);
        expect(audioPlayerMock.volume).toBe(0.2);
        expect(audioPlayerMock.play).toHaveBeenCalled();
    });

    test('should handle autoplay being prevented', async () => {
        // Mock the play method to reject the promise (simulate autoplay prevention)
        audioPlayerMock.play.mockRejectedValueOnce(new Error('Autoplay prevented'));

        // Trigger the DOMContentLoaded event
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Check if error is logged
        await expect(audioPlayerMock.play).rejects.toThrow('Autoplay prevented');
    });
});