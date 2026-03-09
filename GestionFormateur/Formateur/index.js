const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const Formateur = mongoose.model('Formateur');
const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://zaid:zaid123@cluster0.9tmpsf7.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority/GestionFormateur'
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err))
)
//Ajouter une formateur
app.post('/formateurs', async (req, res) => {
    try {
        const newFormateur = new Formateur(req.body);
        await newFormateur.save();
        res.status(201).send(newFormateur);
    } catch (err) {
        res.status(400).json({ message: 'Erreur,Id Ou Matricule existent deja' });
    }
});

//rechercher un formateur par matricule

app.get('/formateurs/matricle/:matricule',async (req,res) =>{
    try {
        const formateur = await Formateur.findOne({matricule: req.params.matricule})
        formateur ? res.json(formateur) : res.status(404).json({message : 'Formateur non troube'});
    } catch (error) {
        res.status(500).json(error);
    };
    });

//augmenter l'echelle du formateur par matricule
app.put('/formateurs/matricule/:matricule/echelle-up',async (req,res) => {
    try {
        const formateur = await Formateur.findOneAndUpdate({matricule:req.params.matricule},{$inc :{echelle: 1}},{new : true});
        res.json(formateur);
    } catch (error) {
        res.status(500).json(error);
    }
});
//supprimer un formateur par id (il faut supprimer d'abord ses abcsences )

app.delete('/formateurs/:id', async(req,res)=> {
    try {
        await axios.delete(`http://localhost:3002/absences/formateur/${req.params.id}`);

        await Formateur.findByIdAndDelete(req.params.id);
        req.json({message: 'formateur et ses absences ont ete supprimes.'});
    } catch (error) {
        res.status(500).json({message: 'Erreur du supression', error});
    }
});

//afficher les formateurs ayant au moins une abscence non justifiee
app.get('/formateurs/absences-non-justifiees', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/absences/non-justifiees');
        const formateurIds = response.data;

        const formateurs = await Formateur.find({_id: {$in: formateurIds}});
        res.status(200).json(formateurs);
    } catch(error){
        res.status(500).json(error)
    }
});

// recuperer l'id des formateurs selon echelle

app.get('/formateurs/ids-par-echelle/:min/:max', async (req, res) => {
    try {
        const formateurs = await Formateur.find({ 
            echelle: { $gte: req.params.min, $lte: req.params.max } 
        });
        const ids = formateurs.map(f => f._id);
        res.status(200).json(ids);
    } catch (error) { res.status(500).json(error); }
});
app.listen(3001, () => console.log('Service Formateur démarré sur le port 3001'));