const {jsdom} = require('jsdom');
const {mongoose, databaseUrl, options} = require('../database');
const Video = require('../models/video');

const getVideoTestObject = (options = {}) => {
    return Object.assign({
        title: 'Test Video Title',
        description: 'Test Video Description',
        videoUrl: 'https://youtu.be/jlGBer0VoF8'
    }, options);
};

const parseTextFromHTML = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        if (selectedElement.value) return selectedElement.value;
        return selectedElement.textContent;
    } else {
        throw new Error(`No element with selector ${selector} found in HTML string`);
    }
};

const dbHelper = {
    async connectAndDrop() {
        await mongoose.connect(databaseUrl, options);
        await mongoose.connection.db.dropDatabase();
    },
    async disconnect() {
        await mongoose.disconnect();
    },

    // Create mutlpile dummy objects
    async seedDatabase(count = 1, options) {
        const video = getVideoTestObject(options);
        const videoCollection = [];

        if (count > 1) {
            while (count >= 1) {
                videoCollection.push(new Video(video));
                --count;
            }

            return await Video.collection.insert(videoCollection);
        }

        return await Video.create(video);
    }
};

module.exports = {
    parseTextFromHTML,
    getVideoTestObject,
    dbHelper,
};
