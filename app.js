const express = require('express');
const dotenv = require('dotenv');
const connect = require('./data/db');
const apievents = require('./middlewares/apievents');
const memberRouter = require('./routers/memberRouter');
const eventRouter = require('./routers/eventRouter');
const attendanceRouter = require('./routers/attendanceRouter');
const app = express();
const port = process.env.port || 3000;


dotenv.config({ path: './config.env' });
connect();


app.use(express.json());
app.use((req, res, next) => {
    apievents.emit('OnHttpRequestEvent', req, res, next);
});
app.use('/api/members', memberRouter);
app.use('/api/events', eventRouter);
app.use('/api/attendance', attendanceRouter);
app.use((err, req, res, next) => {
    res.status(400).send({
        result: 'Internal Error',
        errorMessage: err.message,
        errorStack: err.stack
    });
});


app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${port}`);
});
