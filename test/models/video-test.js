const {assert} = require('chai');
const Video = require('../../models/video');
const {dbHelper, getVideoTestObject} = require('../helpers');

describe('Model: Video', () => {

    beforeEach(dbHelper.connectAndDrop);
    afterEach(dbHelper.disconnect);

    describe('#title', () => {

        it('is a String', () => {
            const titleAsNonString = 1;
            const videoTestObject = getVideoTestObject({
                title: titleAsNonString
            });

            const video = new Video(videoTestObject);

            assert.strictEqual(video.title, titleAsNonString.toString());
        });

        it('is required', () => {
            const video = new Video({});
            video.validateSync();

            assert.equal(video.errors.title.message, 'Title is required');
        });

    });

    describe('#description', () => {

        it('is a String', () => {
            const descriptionAsNonString = 1;
            const videoTestObject = getVideoTestObject({
                description: descriptionAsNonString
            });

            const video = new Video(videoTestObject);

            assert.strictEqual(video.description, descriptionAsNonString.toString());
        });

        it('is required', () => {
            const video = new Video({});
            video.validateSync();

            assert.equal(video.errors.description.message, 'Description is required');
        });

    });

    describe('#video-url', () => {

        it('is a String', () => {
            const urlAsNonString = 1;
            const videoTestObject = getVideoTestObject({
                videoUrl: urlAsNonString
            });

            const video = new Video(videoTestObject);

            assert.strictEqual(video.videoUrl, urlAsNonString.toString());
        });

        it('is required', () => {
            const video = new Video({});
            video.validateSync();

            assert.equal(video.errors.videoUrl.message, 'Video Url is required');
        });

        it('is a valid URL', () => {
            const video = new Video({videoUrl: 'ftp://invalid.url'});
            video.validateSync();

            assert.equal(video.errors.videoUrl.message, 'Video URL is not a valid URL');
        });

    });

});