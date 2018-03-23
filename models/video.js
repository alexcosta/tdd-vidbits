const {mongoose} = require('../database');
const validate = require('mongoose-validator');
const sanitizerPlugin = require('mongoose-sanitizer');

const urlValidator = [
    validate({
        validator: 'isURL',
        arguments: { protocols: ['http','https'] },
        message: 'Video URL is not a valid URL'
    })
];

const Video = mongoose.model(
    'Video',
    mongoose.Schema({
        title: {
            required: [true, 'Title is required'],
            type: String,
            trim: true
        },
        description: {
            required: [true, 'Description is required'],
            type: String,
            trim: true
        },
        videoUrl: {
            required: [true, 'Video Url is required'],
            type: String,
            trim: true,
            validate: urlValidator
        },

    }).plugin(sanitizerPlugin)
);

module.exports = Video;
