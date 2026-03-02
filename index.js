const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// Configuration du cnx mysql

const db = mysql.createConnection({
    host: 'localhost' ,
    user: 'root',
    password: '',
    database: 'gestion_stagiaires'
});

db.connect(err=> {
    if (err) throw err;
    console.log('Connecté à la base de données');
});

// listener sur port 3000
const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// 2.	Créer une API pour insérer un nouvel stagiaire. Vous devez vérifier d’abord l’existence du groupe dans la base de données.

app.post('/api/stagiares', (req, res)=> {
    const {nom, prenom, ville, id_groupe } = res.body;
    //verifier l'existence du groupe dans bd
    db.query('SELECT * FROM groupe where id = ?' , [id_groupe], (err,results)=>{
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(404).json({ message: "ce groupe n'existe pas"})
        }
    //if exists
    const sqlInsert = 'INSERT INTO stagiaire (nom,prenom,ville,id_groupe) VALUES (?,?,?,?)';
    db.query(sqlInsert, [nom,prenom,ville,id_groupe], (err,result)=> {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "stagiaire ajoute avec succes", id: result.insertId});
    });
    });
});
// 3.	Créer une API pour modifier la ville des stagiaires du groupe dont l’id est donné en paramètre.

app.put('/api/stagiaire/groupe/:id/ville', (req ,res)=> {
    const id_groupe = req.params.id;
    const { nouvelle_ville } = req.body;

    const sql = 'UPDATE stagiaire SET ville=? WHERE id_groupe = ?';
    db.query(sql, [nouvelle_ville, id_groupe], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: `${result.affectedRows} stagiares mis a jour. `});
    });
});

// 4.	Créer une API pour supprimer les formateurs dont la ville est donnée en paramètre.

app.delete('/api/formateurs/ville/:ville', (req,res) =>{
    const ville = req.params.ville;

    const sql = 'DELETE FROM formateur WHERE ville = ?';
    db.query(sql, [ville], (err, result) => {
        if (err) retun
    })
})