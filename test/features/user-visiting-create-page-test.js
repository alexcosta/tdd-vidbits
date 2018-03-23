const {assert} = require('chai');
const {dbHelper, getVideoTestObject} = require('../helpers');

describe('User visits /videos/create', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('posts a new video', () => {

        it('video is rendered at /', () => {
            const videoToCreate = getVideoTestObject();

            browser.url('/videos/create');
            browser.setValue('#title-input', videoToCreate.title);
            browser.setValue('#description-input', videoToCreate.description);
            browser.setValue('#video-url', videoToCreate.videoUrl);
            browser.click('#submit-button');
            browser.url('/');

            assert.include(browser.getText('body'), videoToCreate.title);
            assert.include(browser.getText('body'), videoToCreate.description);
            assert.include(browser.getAttribute('.video-embed', 'src'), videoToCreate.videoUrl);
        });

        it('form posts to /videos/create', () => {
            const expectedFormAction = '/videos/create';

            browser.url('/videos/create');

            assert.include(
                browser.getAttribute('#create-video-form', 'action'),
                expectedFormAction
            );
        });
    });

    describe('and can navigate', () => {
        it('to home page /', () => {
            browser.url('/videos/create');
            const expectedPath = browser.getAttribute('#home-link', 'href');
            browser.click('#home-link');
            const currentPath = browser.getUrl();

            assert.equal(currentPath, expectedPath);
        });
    });
});