const express = require('express');
const router = express.Router();
const db = require('../db');

function authGet(req, res, next) {
    const apiKey = req.headers['password'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'API key es requerida' });
    if (apiKey !== process.env.API_PASSWORD_GET) return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    next();
}

function authAdmin(req, res, next) {
    const apiKey = req.headers['password'];
    const role = req.headers['x-user-role'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'API key es requerida' });
    if (apiKey !== process.env.API_PASSWORD_ADMIN) return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    if (role !== 'admin') return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
    next();
}

router.get('/maestros', authGet, (req, res) => {
    const { nombre, apellido, especialidad, email, telefono } = req.query;

    let query = 'SELECT * FROM Profesores WHERE 1=1';
    const params = [];

    if (nombre) { query += ' AND Nombre LIKE ?'; params.push(`%${nombre}%`); }
    if (apellido) { query += ' AND Apellido LIKE ?'; params.push(`%${apellido}%`); }
    if (especialidad) { query += ' AND Especialidad LIKE ?'; params.push(`%${especialidad}%`); }
    if (email) { query += ' AND Email LIKE ?'; params.push(`%${email}%`); }
    if (telefono) { query += ' AND Telefono LIKE ?'; params.push(`%${telefono}%`); }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows });
    });
});

router.get('/maestros/:id', authGet, (req, res) => {
    db.get('SELECT * FROM Profesores WHERE ProfesorId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
        res.json({ success: true, data: row });
    });
});

router.post('/maestros', authAdmin, (req, res) => {
    const { nombre, apellido, especialidad, email, telefono } = req.body;

    if (!nombre || !apellido || !especialidad || !email || !telefono) {
        return res.status(400).json({ success: false, message: 'nombre, apellido, especialidad, email y telefono son obligatorios' });
    }

    db.get('SELECT ProfesorId FROM Profesores WHERE Email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (row) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

        db.run(
            'INSERT INTO Profesores (Nombre, Apellido, Especialidad, Email, Telefono) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, especialidad, email, telefono],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(201).json({ success: true, data: { id: this.lastID, nombre, apellido, especialidad, email, telefono } });
            }
        );
    });
});

router.put('/maestros/:id', authAdmin, (req, res) => {
    const { nombre, apellido, especialidad, email, telefono } = req.body;

    if (!nombre || !apellido || !especialidad || !email || !telefono) {
        return res.status(400).json({ success: false, message: 'nombre, apellido, especialidad, email y telefono son obligatorios' });
    }

    db.get('SELECT ProfesorId FROM Profesores WHERE ProfesorId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Maestro no encontrado' });

        db.run(
            'UPDATE Profesores SET Nombre = ?, Apellido = ?, Especialidad = ?, Email = ?, Telefono = ? WHERE ProfesorId = ?',
            [nombre, apellido, especialidad, email, telefono, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, data: { id: req.params.id, nombre, apellido, especialidad, email, telefono } });
            }
        );
    });
});

router.delete('/maestros/:id', authAdmin, (req, res) => {
    db.get('SELECT ProfesorId FROM Profesores WHERE ProfesorId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Maestro no encontrado' });

        db.run('DELETE FROM Profesores WHERE ProfesorId = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, data: 'El maestro se ha eliminado' });
        });
    });
});

module.exports = router;