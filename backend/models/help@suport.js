const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    subject: {
        type: String,
        required: true,
        enum: ['donation', 'request', 'account', 'technical', 'other']
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'open',
        enum: ['open', 'in-progress', 'resolved']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SupportRequest', supportRequestSchema);