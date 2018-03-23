const {assert} = require('chai');
const request = require('supertest');
const httpStatusCode = require('http-status-codes');
const app = require('../../app');
const {dbHelper, parseTextFromHTML} = require('../helpers');

describe('Server path: /videos/:id', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('GET', () => {
        it('renders a title', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app).get(`/videos/${video.id}`);
            assert.include(response.text, video.title);
        });

        it('renders a description', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app).get(`/videos/${video.id}`);
            assert.include(response.text, video.description);
        });

        it('renders a video', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app).get(`/videos/${video.id}`);
            assert.include(response.text, video.videoUrl);
        });

        it('renders video modification links', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app).get(`/videos/${video.id}`);
            assert.exists(parseTextFromHTML(response.text, '#update-video'));
            assert.exists(parseTextFromHTML(response.text, '#remove-video'));
        });

        it('redirects to index if no id in path', async () => {
            await request(app)
                .get('/videos')
                .expect(httpStatusCode.MOVED_TEMPORARILY)
                .expect('Location', '/');
        });

    });

    describe('POST', () => {
        it('return 404 status', async () => {
            const video = await dbHelper.seedDatabase();
            await request(app)
                .post(`/videos/${video.id}`)
                .type('form')
                .expect(httpStatusCode.NOT_FOUND)
                .send({});
        });
    });
});
