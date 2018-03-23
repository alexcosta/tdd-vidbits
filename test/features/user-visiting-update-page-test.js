const {assert} = require('chai');
const {dbHelper} = require('../helpers');

describe('User visits /videos/:id/update', () => {

    let videoToUpdate;

    beforeEach(async () => {
        dbHelper.connectAndDrop();
        videoToUpdate = await dbHelper.seedDatabase();
    });

    afterEach(dbHelper.disconnect);

    describe('to update a video', () => {
        it('posts to /videos/:id/update', async () => {
            const expectedFormAction = `/videos/${videoToUpdate.id}/update`;

            await browser.url(expectedFormAction);
            const actualFormAction = await browser.getAttribute('#update-video-form', 'action');

            assert.include(
                actualFormAction,
                expectedFormAction
            );
        });

        it('form fields have the correct values', () => {
            browser.url(`/videos/${videoToUpdate.id}/update`);

            assert.equal(browser.getValue('#title-input'), videoToUpdate.title);
            assert.equal(browser.getValue('#description-input'), videoToUpdate.description);
            assert.equal(browser.getValue('#video-url'), videoToUpdate.videoUrl);
        });

        it('video is rendered after submit', () => {
            const updatedVideo = Object.assign(videoToUpdate, {
                title: 'Update Title Test',
                description: 'Update Description Test',
                videoUrl: 'https://www.youtube.com/embed/vWaljXUiCaE'
            });

            browser.url(`/videos/${videoToUpdate.id}/update`);
            browser.setValue('#title-input', updatedVideo.title);
            browser.setValue('#description-input', updatedVideo.description);
            browser.setValue('#video-url', updatedVideo.videoUrl);
            browser.click('#submit-button');

            assert.include(browser.getText('body'), updatedVideo.title);
            assert.include(browser.getText('body'), updatedVideo.description);
            assert.include(browser.getAttribute('#video-embed', 'src'), updatedVideo.videoUrl);
        });
    });

    describe('and can navigate', () => {
        it('to home page /', () => {
            browser.url('/videos/create');
            const expectedPath = browser.getAttribute('#home-link', 'href');
            browser.click('#home-link');

            assert.equal(browser.getUrl(), expectedPath);
        });
    });
});