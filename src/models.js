import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    ts: {
        type: Date,
        required: true
    }
});

export const Track = mongoose.model('Track', trackSchema);
