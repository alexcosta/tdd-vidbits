const router = require('express').Router();
const httpStatusCode = require('http-status-codes');
const Video = require('../models/video');

router.get('/', async (req, res, next) => {
    const videos = await Video.find({});
    res.render('index', {videos});
});

router.get('/videos', async (req, res, next) => {
    res.redirect('/');
});

router.get('/videos/create', async (req, res, next) => {
    res.render('video/create');
});

router.post('/videos/create', async (req, res, next) => {
    const video = new Video(req.body);

    video.validateSync();

    if (video.errors) {
        return res.status(httpStatusCode.UNPROCESSABLE_ENTITY).render('video/create', {video});
    }

    await video.save();

    res.redirect(`/videos/${video.id}`);
});

router.get('/videos/:id', async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    res.render('video/show', {video});
});

router.get('/videos/:id/update', async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    res.render('video/update', {video});
});

router.post('/videos/:id/update', async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    const updatedVideo = Object.assign(video, req.body);

    updatedVideo.validateSync();

    if (updatedVideo.errors) {
        return res.status(httpStatusCode.UNPROCESSABLE_ENTITY).render('video/update', {video});
    }

    await updatedVideo.save();
    res.redirect(`/videos/${updatedVideo.id}`);
});

router.post('/videos/:id/remove', async (req, res, next) => {
    const video = await Video.findByIdAndRemove(req.params.id);
    if (!video) return res.status(httpStatusCode.BAD_REQUEST).send();
    res.redirect('/');
});

module.exports = router;