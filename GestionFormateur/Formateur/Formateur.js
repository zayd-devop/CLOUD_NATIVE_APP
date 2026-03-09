const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    _id : {type: Number, required: true, unique: true},
    matricle : {type: String, required: true, unique: true},
    nom : {type: String, required: true},
    echelle : {type: Number, required: true},
});

mongoose.model('Formateur', formateurSchema);