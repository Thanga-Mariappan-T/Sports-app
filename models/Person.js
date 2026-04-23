const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    favoriteSports: { type: [String], required: true } 
});

module.exports = mongoose.model('Person', PersonSchema);
