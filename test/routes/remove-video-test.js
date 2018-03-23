const {assert} = require('chai');
const request = require('supertest');
const httpStatusCode = require('http-status-codes');
const app = require('../../app');
const Video = require('../../models/video');
const {dbHelper} = require('../helpers');

describe('Server path: /videos/:id/remove', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('GET', () => {
        it('returns 404 status', async () => {
            const video = await dbHelper.seedDatabase();
            await request(app)
                .get(`/videos/${video.id}/remove`)
                .expect(httpStatusCode.NOT_FOUND);
        });
    });

    describe('POST', () => {
        it('removes a video from the database', async () => {
            const video = await dbHelper.seedDatabase();

            await request(app)
                .post(`/videos/${video.id}/remove`)
                .type('form')
                .send();

            const removedVideo = await Video.findOne(video);

            assert.isNull(removedVideo, 'Video was not removed from the database');
        });

        it('redirects to /', async () => {
            const video = await dbHelper.seedDatabase();

            await request(app)
                .post(`/videos/${video.id}/remove`)
                .type('form')
                .expect(httpStatusCode.MOVED_TEMPORARILY)
                .expect('Location', '/')
                .send();
        });
    });
});
