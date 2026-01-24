// Mongoose schema for gallery images
// Fields: title, imageUrl
// Enable timestamps so createdAt is available for sorting
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    // Optional: associate with a service card (by title or key)
    service: {
        type: String,
        required: false,
        default: ''
    },
    // Optional: markdown content for options/features shown under the service
    optionsMarkdown: {
        type: String,
        required: false,
        default: ''
    },
    // Optional display order (lower numbers first)
    order: {
        type: Number,
        required: false,
        default: null
    }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;