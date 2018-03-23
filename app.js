const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const logger = require('morgan');
const bodyParser = require('body-parser');
const videoRoutes = require('./routes/videos');

const app = express();

// View engine setup
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'app',
    helpers: {
        // Allow grouping inside templates to create rows
        group_each: (every = 4, context, options) => {
            let html = '';
            let subcontext = [];

            if (!context || !context.length) return html;

            for(let [idx, val] of context.entries()) {
                if (idx > 0 && idx % every === 0) {
                    html += options.fn(subcontext);
                    subcontext = [];
                }
                subcontext.push(val);
            }

            html += options.fn(subcontext);
            return html;
        }
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', videoRoutes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
