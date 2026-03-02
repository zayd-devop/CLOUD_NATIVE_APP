const express = require('express');
const app = express();
const equipes = require('./equipes.json');

app.use(express.json());

//1. GET - Recuperation des Equipes
app.get('./equipes', (req, res) => {
    res.status(200).json(equipes);
});
//2. GET - Recuperation d'une equipe specifique via ID

app.get('/equipes/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const equipe = equipes.find(e=>e.id === id);
    res.status(200).json(equipe);
});
app.post('./')

