
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const querySchema = new Schema({
    BANK: { type: String },
    IFSC: { type: String},
    BRANCH: { type: String},
    ADDRESS: { type: String},
    CITY1: { type: String},
    CITY2: { type: String},
    STATE: { type: String},

    STD_CODE: { type: Number },
    PHONE: { type: String }, 

 });

 const Query = mongoose.model("Banks", querySchema);
 
 module.exports = Query;