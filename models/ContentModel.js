const express = require('express');
const mongoose = require('mongoose');

const ContentSchema = mongoose.Schema({
    title: String,
    description: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const ContentModel = mongoose.model('ContentModel', ContentSchema)
module.exports= ContentModel