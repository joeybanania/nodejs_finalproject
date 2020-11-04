const mongoose = require('mongoose');
const AttendanceModel = require('../data/model/attendance');
const MemberModel = require('../data/model/member');
const EventModel = require('../data/model/event');

exports.recordExists = async (req, res, next) => {
    await AttendanceModel.findById(req.params.id, (err, attendance) => {
        if (err) {
            next(err);
        }
        else {
            if (attendance == null) {
                next(new Error('Attendance record not found'));
            }
        }
    });
};
exports.getAttendance = async (req, res, next) => {
    await AttendanceModel
        .find({})
        .populate('event')
        .populate('member')
        .exec((err, attendance) => {
            if (err) {
                return next(err);
            }
            res.status(200).send(attendance);
        });
};
exports.getAttendanceById = async (req, res, next) => {
    await AttendanceModel
        .findById(req.params.id)
        .populate('event')
        .populate('member')
        .exec((err, attendance) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(attendance);
        });
};
exports.createAttendance = async (req, res, next) => {
    try {
        let data = req.body;
        let newAttendance = new AttendanceModel();

        newAttendance._id = mongoose.Types.ObjectId();

        Object.keys(data).forEach(propName => {
            newAttendance[propName] = data[propName];
        });

        await EventModel.findById(newAttendance.event, (err, event) => {
            if (err) {
                return next(err);
            }

            if (event === null) {
                return next(new Error('Event Id not found'));
            }
        });
        await MemberModel.findById(newAttendance.member, (err, member) => {
            if (err) {
                return next(err);
            }

            if (member === null) {
                return next(new Error('Member Id not found'));
            }
        });
        await newAttendance
            .save()
            .then(savedAttendance => {
                MemberModel.findByIdAndUpdate(savedAttendance.member, {
                    $push: {
                        attendance: newAttendance._id
                    }
                }).exec();

                return savedAttendance;
            })
            .then(savedAttendance => {
                EventModel.findByIdAndUpdate(savedAttendance.event, {
                    $push: {
                        attendance: newAttendance._id
                    }
                }).exec();
            });

        res.status(200).send('Attendance record created');

    } catch (err) {
        next(err);
    }
};
exports.updateAttendance = async (req, res, next) => {
    await AttendanceModel.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Attendance record updated');
    });
};
exports.deleteAttendance = async (req, res, next) => {
    await AttendanceModel.findOneAndRemove({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Attendance record deleted');
    });
};
