const {assert} = require('chai');
const {dbHelper} = require('../helpers');

describe('User visits /', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('without videos in the database', () => {
        it('no videos are displayed', () => {
            browser.url('/');

            assert.equal(browser.getText('#videos-container'), '');
        });
    });

    describe('with videos in the databse', () => {
        it('all videos are displayed', async () => {
            const videosInDatabase = 5;

            await dbHelper.seedDatabase(videosInDatabase);
            await browser.url('/');

            const videoCollection = await browser.elements('.video');

            assert.equal(videoCollection.value.length, videosInDatabase);
        });
    });

    describe('and can navigate', () => {
        it('to create video page /videos/create', () => {
            browser.url('/');
            const expectedPath = browser.getAttribute('#create-video', 'href');
            browser.click('#create-video');
            const currentPath = browser.getUrl();

            assert.equal(currentPath, expectedPath);
        });

        it('to view single video page video/:id', async () => {
            await dbHelper.seedDatabase();

            await browser.url('/');
            const expectedPath = await browser.getAttribute('a.title-link', 'href');

            await browser.click('a.title-link');
            const currentPath = await browser.getUrl();

            assert.equal(currentPath, expectedPath);
        });
    });
});