/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
global.$ = $;

describe('Comments Frontend', () => {
    let server;

    beforeEach(() => {
        // Set up the DOM
        document.body.innerHTML = `
            <div id="loading-indicator" style="display: none;"></div>
            <ul id="comments-list" class="list-group"></ul>
            <form id="comment-form">
                <input id="name" type="text" />
                <span id="name-error" style="display: none;">Name must be at least 3 characters long.</span>
                <textarea id="comment"></textarea>
                <span id="comment-error" style="display: none;">Comment must be at least 10 characters long.</span>
                <button id="submit-btn" type="submit">Submit</button>
            </form>
        `;

        // Mock the server
        server = jest.fn();
        $.ajax = jest.fn((options) => {
            const { url, type, data, success, error, complete } = options;

            if (url === '/comments' && type === 'GET') {
                server.mockResolvedValueOnce([]);
                success([]);
                complete();
            }

            if (url === '/comments' && type === 'POST') {
                server.mockResolvedValueOnce([]);
                success();
            }
        });

        // Load the script
        require('../comments');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('loadComments', async function () {});
});
