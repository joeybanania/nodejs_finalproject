const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const EventModel = require('../data/model/event');

exports.recordExists = async (req, res, next) => {
    let id = req.params.id ?? req.query.eventId;

    console.log(id);

    await EventModel.findById(id, (err, event) => {
        if (err) {
            next(err);
        }
        else {
            if (event == null) {
                next(new Error('Event record not found'));
            }
        }
    });
};
exports.getEvents = async (req, res, next) => {
    await EventModel
        .find({})
        .populate({ path: 'attendance', populate: { path: 'member' } })
        .exec((err, events) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(events);
        });
};
exports.getEventById = async (req, res, next) => {
    await EventModel
        .findById(req.params.id)
        .populate({ path: 'attendance', populate: { path: 'member' } })
        .exec((err, event) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(event);
        });
};
exports.getEventBySearch = async (req, res, next) => {
    let query = {};

    if (req.query.name) {
        query.name = req.query.name;
    }
    if (req.query.startDate) {
        query.startDate = req.query.startDate;
    }
    if (req.query.endDate) {
        query.endDate = req.query.endDate;
    }

    await EventModel
        .find(query)
        .populate({ path: 'attendance', populate: { path: 'member' } })
        .exec((err, events) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(events);
        });
};
exports.getEventExport = async (req, res, next) => {
    await EventModel
        .findById(req.query.eventId)
        .populate({ path: 'attendance', populate: { path: 'member' } })
        .exec((err, event) => {
            if (err) {
                return next(err);
            }

            let fields = ['Member', 'TimeIn', 'TimeOut'];
            let opts = { fields };
            let parser = new Parser(opts);
            let csv = parser.parse(event);
            let csvFile = path.join(process.cwd(), `${event.name}_${event.startDate}`);

            fs.writeFile(csvFile, csv, { flag: 'w' }, (writeError) => {
                if (writeError) {
                    return next(new Error(`Error writing csvfile: ${writeError}`));
                }

                console.log(`Done writing csvfile in: ${csvFile}`);
            });


            res.status(200).send('Done exporting Event to CSV');
        });
};
exports.createEvent = async (req, res, next) => {
    try {
        let data = req.body;
        let newEvent = new EventModel();

        newEvent._id = mongoose.Types.ObjectId();

        Object.keys(data).forEach(propName => {
            newEvent[propName] = data[propName];
        });

        await newEvent.save();
        res.status(200).send('Event record created');
    } catch (err) {
        next(err);
    }
};
exports.updateEvent = async (req, res, next) => {
    await EventModel.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Event record updated');
    });
};
exports.deleteEvent = async (req, res, next) => {
    await EventModel.findOneAndRemove({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Event record deleted');
    });
};
