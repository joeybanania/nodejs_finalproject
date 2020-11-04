const mongoose = require('mongoose');
const memberSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    joinedDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active',
        required: true
    },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance'
    }]

});

module.exports = mongoose.model('Member', memberSchema);