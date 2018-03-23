const {assert} = require('chai');
const request = require('supertest');
const httpStatusCode = require('http-status-codes');
const app = require('../../app');
const Video = require('../../models/video');
const {dbHelper, parseTextFromHTML} = require('../helpers');

describe('Server path: /videos/:id/update', () => {
    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('GET', () => {
        it('returns update video form', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app)
                .get(`/videos/${video.id}/update`)
                .expect(httpStatusCode.OK);

            assert.exists(parseTextFromHTML(response.text, '#update-video-form'));
            assert.exists(parseTextFromHTML(response.text, '#title-input'));
            assert.exists(parseTextFromHTML(response.text, '#description-input'));
            assert.exists(parseTextFromHTML(response.text, '#video-url'));
            assert.exists(parseTextFromHTML(response.text, '#submit-button'));
        });
    });

    describe('POST', () => {
        it('updates video in database', async () => {
            const videoToUpdate = await dbHelper.seedDatabase();
            const videoUpdate = {
                title: 'Update Title Test',
                description: 'Update Description Test',
                videoUrl: 'https://www.youtube.com/embed/vWaljXUiCaE'
            };

            await request(app)
                .post(`/videos/${videoToUpdate.id}/update`)
                .type('form')
                .send(videoUpdate);

            const updatedVideo = await Video.findById(videoToUpdate.id);

            assert.equal(videoUpdate.title, updatedVideo.title);
            assert.equal(videoUpdate.description, updatedVideo.description);
            assert.equal(videoUpdate.videoUrl, updatedVideo.videoUrl);
        });

        it('redirects to show /videos/:id', async () => {
            const videoToUpdate = await dbHelper.seedDatabase();
            const videoUpdate = {
                title: 'Update Title Test',
                description: 'Update Description Test',
                videoUrl: 'https://www.youtube.com/embed/vWaljXUiCaE'
            };

            const response = await request(app)
                .post(`/videos/${videoToUpdate.id}/update`)
                .type('form')
                .expect(httpStatusCode.MOVED_TEMPORARILY)
                .send(videoUpdate);

            const updatedVideo = await Video.findById(videoToUpdate.id);

            assert.equal(response.headers.location, `/videos/${updatedVideo.id}`);
        });

        it('persists fields on validation error', async () => {
            const videoToUpdate = await dbHelper.seedDatabase();
            const {title, description, videoUrl} = videoToUpdate;
            const videoUpdate = Object.assign({
                title, description, videoUrl
            }, {title: ''});

            const response = await request(app)
                .post(`/videos/${videoToUpdate.id}/update`)
                .type('form')
                .expect(httpStatusCode.UNPROCESSABLE_ENTITY)
                .send(videoUpdate);

            assert.equal(parseTextFromHTML(response.text, '#description-input'), videoToUpdate.description);
            assert.equal(parseTextFromHTML(response.text, '#video-url'), videoToUpdate.videoUrl);
        });

        it('returns an error if missing a field', async () => {
            const video = await dbHelper.seedDatabase();
            const invalidUpdate = {
                title: '',
                description: '',
                videoUrl: ''
            };

            const response = await request(app)
                .post(`/videos/${video.id}/update`)
                .type('form')
                .expect(httpStatusCode.UNPROCESSABLE_ENTITY)
                .send(invalidUpdate);

            assert.include(response.text, 'Title is required');
            assert.include(response.text, 'Description is required');
            assert.include(response.text, 'Video Url is required');
        });
    });
});
