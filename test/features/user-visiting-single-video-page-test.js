const {assert} = require('chai');
const Video = require('../../models/video');
const {dbHelper} = require('../helpers');

describe('User visits /videos/:id', () => {

    beforeEach(dbHelper.connectAndDrop);

    afterEach(dbHelper.disconnect);

    describe('views a video', () => {
        it('video is rendered', async () => {
            const video = await dbHelper.seedDatabase();
            await browser.url(`/videos/${video.id}`);

            assert.include(await browser.getAttribute('#video-embed', 'src'), video.videoUrl);
        });
    });

    describe('and can navigate', () => {
        it('to update video page /videos/:id/update', async () => {
            const video = await dbHelper.seedDatabase();
            await browser.url(`/videos/${video.id}`)
                .click('#update-video');

            assert.include(await browser.getUrl(), `/videos/${video.id}/update`);
        });

        it('to remove video page /videos/:id/remove', async () => {
            const video = await dbHelper.seedDatabase();
            await browser.url(`/videos/${video.id}`)
                .click('#remove-video');

            const videoStillExists = await Video.findById(video.id);

            assert.isNull(videoStillExists);
        });

        it('to home page /', async () => {
            const video = await dbHelper.seedDatabase();

            await browser.url(`/videos/${video.id}`);
            const expectedPath = await browser.getAttribute('#home-link', 'href');
            await browser.click('#home-link');
            const currentPath = await browser.getUrl();

            assert.equal(currentPath, expectedPath);
        });
    });
});