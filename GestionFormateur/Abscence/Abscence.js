const mongoose = require('mongoose');

const abscenceSchema = new mongoose.Schema({
    _id : {type: Number, required: true, unique: true},
    formateur_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: true},
    dateAbs : {type: Date, required: true},
    justifAbs : {type: String, required: true},
});

mongoose.model('Abscence', abscenceSchema);