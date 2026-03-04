const express = require('express');
const mysql = require('mysql2');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel_api'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// const secretKey = 'ofppt_secret_key';

app.post('/api/clients', (req, res) => {
    const { name, email, password } = req.body;
    connection.query('INSERT INTO clients (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'Client created', clientId: results.insertId });
    });
});

app.get('/api/clients', (req, res) => {
    connection.query('SELECT * FROM clients', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/api/reservations', (req, res) => {
    const { client_id, chambre_id, date_arrivee, date_depart } = req.body;
    db.query('SELECT disponible FROM chambres WHERE id = ?', [chambre_id], (err, chambres) => {
        if (err) return res.status(500).send(err.message);
        
        if (chambres.length === 0 || chambres[0].disponible === 0) {
            return res.status(400).send("Désolé, cette chambre n'est pas disponible.");
        }
        db.query(
            'INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES (?, ?, ?, ?)',
            [client_id, chambre_id, date_arrivee, date_depart],
            (err, resultInsert) => {
                if (err) return res.status(500).send(err.message);
                db.query('UPDATE chambres SET disponible = 0 WHERE id = ?', [chambre_id], (err, resultUpdate) => {
                    if (err) return res.status(500).send(err.message);
                    res.send("Réservation effectuée avec succès !");
                });
            }
        );
    });
});

// Requetes SQL avannces

app.get('/api/chambres/disponibles', (req, res) => {
    const { date_arrivee, date_depart } = req.query;
    connection.query('SELECT * FROM chambres WHERE disponible = 1 AND id NOT IN (SELECT chambre_id FROM reservations WHERE date_arrivee <= ? AND date_depart >= ?)', 
        [date_depart, date_arrivee], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    }
    );
});

// 3.	Implémentez une route pour calculer le revenu total généré par les réservations entre deux dates.
app.get('/api/revenus', (req, res) => {
    const { date_debut, date_fin } = req.query;
    const sql = 'SELECT SUM(chambres.prix) AS revenu_total FROM reservations JOIN chambres ON reservations.chambre_id = chambres.id WHERE reservations.date_arrivee >= ? AND reservations.date_depart <= ?';
    connection.query(sql, [date_debut, date_fin], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ revenu_total: results[0].revenu_total });
    });
});

// 4.	Implémentez une route pour afficher les clients qui ont effectué plus de 3 réservations au cours des 6 derniers mois.

