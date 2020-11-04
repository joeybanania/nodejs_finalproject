const mongoose = require('mongoose');
const attendanceSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: false
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }

});

module.exports = mongoose.model('Attendance', attendanceSchema);