const {assert} = require('chai');
const request = require('supertest');
const httpStatusCode = require('http-status-codes');
const app = require('../../app');
const {dbHelper, parseTextFromHTML} = require('../helpers');

describe('Server path: /', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('GET', () => {
        it('renders create video link', async () => {
            await dbHelper.seedDatabase();
            const response = await request(app).get('/');

            assert.exists(
                parseTextFromHTML(response.text, '#create-video')
            );
        });

        it('renders a video', async () => {
            const video = await dbHelper.seedDatabase();
            const response = await request(app)
                .get('/')
                .expect(httpStatusCode.OK);

            assert.include(response.text, video.title);
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
