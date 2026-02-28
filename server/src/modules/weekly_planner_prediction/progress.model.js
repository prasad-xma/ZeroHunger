const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    weekStartDate: { type: Date, required: true },
    weight: { type: Number, required: true },
    performance: { type: Number } // from meal planner
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);