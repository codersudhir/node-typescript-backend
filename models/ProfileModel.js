const express = require('express');
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    phoneNumber: String,
    businessName: String,
    contactAddress: String,
    gstin: String,
    paymentDetails: String, 
    notes: String, 
    logo: String,
    website: String,
    userId: [String],
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports= Profile