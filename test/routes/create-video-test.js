const {assert} = require('chai');
const request = require('supertest');
const httpStatusCode = require('http-status-codes');
const app = require('../../app');
const Video = require('../../models/video');
const {dbHelper, getVideoTestObject, parseTextFromHTML} = require('../helpers');

describe('Server path: /videos/create', () => {
    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('GET', () => {
        it('returns create video form', async () => {
            const response = await request(app)
                .get('/videos/create')
                .expect(httpStatusCode.OK);

            assert.exists(parseTextFromHTML(response.text, '#create-video-form'));
            assert.exists(parseTextFromHTML(response.text, '#title-input'));
            assert.exists(parseTextFromHTML(response.text, '#description-input'));
            assert.exists(parseTextFromHTML(response.text, '#video-url'));
            assert.exists(parseTextFromHTML(response.text, '#submit-button'));
        });
    });

    describe('POST', () => {
        it('inserts a new video into the database', async () => {
            const videoToCreate = getVideoTestObject();

            await request(app)
                .post('/videos/create')
                .type('form')
                .send(videoToCreate);

            const createdVideo = await Video.findOne(videoToCreate);

            assert.isNotNull(createdVideo, 'Video was not inserted into the database');
        });

        it('redirects to show /videos/:id', async () => {
            const videoToCreate = getVideoTestObject();
            const response = await request(app)
                .post('/videos/create')
                .type('form')
                .expect(httpStatusCode.MOVED_TEMPORARILY)
                .send(videoToCreate);

            const createdVideo = await Video.findOne(videoToCreate);

            assert.equal(response.headers.location, `/videos/${createdVideo._id}`);
        });

        it('persists fields on validation error', async () => {
            const video = getVideoTestObject({title: ''});

            const response = await request(app)
                .post('/videos/create')
                .type('form')
                .expect(httpStatusCode.UNPROCESSABLE_ENTITY)
                .send(video);

            assert.equal(parseTextFromHTML(response.text, '#description-input'), video.description);
            assert.equal(parseTextFromHTML(response.text, '#video-url'), video.videoUrl);
        });

        it('returns an error if missing a field', async () => {
            const video = getVideoTestObject({
                title: '',
                description: '',
                videoUrl: ''
            });

            const response = await request(app)
                .post('/videos/create')
                .type('form')
                .expect(httpStatusCode.UNPROCESSABLE_ENTITY)
                .send(video);

            assert.include(response.text, 'Title is required');
            assert.include(response.text, 'Description is required');
            assert.include(response.text, 'Video Url is required');
        });

        it('returns an error if Video URL is not valid', async () => {
            const video = getVideoTestObject({
                videoUrl: 'ftp://invalid.url'
            });

            const response = await request(app)
                .post('/videos/create')
                .type('form')
                .expect(httpStatusCode.UNPROCESSABLE_ENTITY)
                .send(video);

            assert.include(response.text, 'Video URL is not a valid URL');
        });
    });
});
