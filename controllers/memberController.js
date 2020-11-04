const mongoose = require('mongoose');
const MemberModel = require('../data/model/member');

exports.recordExists = async (req, res, next) => {
    await MemberModel.findById(req.params.id, (err, member) => {
        if (err) {
            next(err);
        }
        else {
            if (member == null) {
                next(new Error('Member record not found'));
            }
        }
    });
};
exports.getMembers = async (req, res, next) => {
    await MemberModel
        .find({})
        .populate({ path: 'attendance', populate: { path: 'event' } })
        .exec((err, members) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(members);
        });
};
exports.getMemberById = async (req, res, next) => {
    await MemberModel
        .findById(req.params.id)
        .populate({ path: 'attendance', populate: { path: 'event' } })
        .exec((err, member) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(member);
        });
};
exports.getMemberBySearch = async (req, res, next) => {
    let query = {};

    if (req.query.name) {
        query.name = req.query.name;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }

    await MemberModel
        .find(query)
        .populate({ path: 'attendance', populate: { path: 'event' } })
        .exec((err, members) => {
            if (err) {
                return next(err);
            }

            res.status(200).send(members);
        });
};
exports.createMember = async (req, res, next) => {
    try {
        let data = req.body;
        let newMember = new MemberModel();

        newMember._id = mongoose.Types.ObjectId();

        Object.keys(data).forEach(propName => {
            newMember[propName] = data[propName];
        });

        await newMember.save();
        res.status(200).send('Member record created');
    } catch (err) {
        next(err);
    }
};
exports.updateMember = async (req, res, next) => {
    await MemberModel.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Member record updated');
    });

};
exports.deleteMember = async (req, res, next) => {
    await MemberModel.findOneAndRemove({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err);
        }

        res.status(200).send('Member record deleted');
    });
};
