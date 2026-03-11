const express = require('express');
const router = express.Router();
const db = require('../db');

// ── MIDDLEWARES DE AUTENTICACIÓN ──────────────────────

function authGet(req, res, next) {
    const apiKey = req.headers['password'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'API key es requerida' });
    if (apiKey !== '12345') return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    next();
}

function authAdmin(req, res, next) {
    const apiKey = req.headers['password'];
    const role = req.headers['x-user-role'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'API key es requerida' });
    if (apiKey !== '6789') return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    if (role !== 'admin') return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
    next();
}

// ── GET: todos los estudiantes ────────────────────────
router.get('/estudiantes', authGet, (req, res) => {
    const { nombre, apellido, genero, email } = req.query;

    let query = 'SELECT * FROM Estudiantes WHERE 1=1';
    const params = [];

    if (nombre)   { query += ' AND Nombre LIKE ?';   params.push(`%${nombre}%`); }
    if (apellido) { query += ' AND Apellido LIKE ?';  params.push(`%${apellido}%`); }
    if (genero)   { query += ' AND Genero LIKE ?';    params.push(`%${genero}%`); }
    if (email)    { query += ' AND Email LIKE ?';     params.push(`%${email}%`); }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows });
    });
});

// ── GET: estudiante por ID ────────────────────────────
router.get('/estudiantes/:id', authGet, (req, res) => {
    db.get('SELECT * FROM Estudiantes WHERE EstudianteId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, data: row });
    });
});

// ── POST: crear estudiante ────────────────────────────
router.post('/estudiantes', authAdmin, (req, res) => {
    const { nombre, apellido, genero, email } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !apellido || !genero || !email) {
        return res.status(400).json({ success: false, message: 'nombre, apellido, genero y email son obligatorios' });
    }

    // Validación: unicidad del email
    db.get('SELECT EstudianteId FROM Estudiantes WHERE Email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (row) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

        db.run(
            'INSERT INTO Estudiantes (Nombre, Apellido, Genero, Email) VALUES (?, ?, ?, ?)',
            [nombre, apellido, genero, email],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(201).json({ success: true, data: { id: this.lastID, nombre, apellido, genero, email } });
            }
        );
    });
});

// ── PUT: actualizar estudiante ────────────────────────
router.put('/estudiantes/:id', authAdmin, (req, res) => {
    const { nombre, apellido, genero, email } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !apellido || !genero || !email) {
        return res.status(400).json({ success: false, message: 'nombre, apellido, genero y email son obligatorios' });
    }

    // Validación: existe el estudiante
    db.get('SELECT EstudianteId FROM Estudiantes WHERE EstudianteId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });

        db.run(
            'UPDATE Estudiantes SET Nombre = ?, Apellido = ?, Genero = ?, Email = ? WHERE EstudianteId = ?',
            [nombre, apellido, genero, email, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, data: { id: req.params.id, nombre, apellido, genero, email } });
            }
        );
    });
});

// ── DELETE: eliminar estudiante ───────────────────────
router.delete('/estudiantes/:id', authAdmin, (req, res) => {

    // Validación: existe el estudiante
    db.get('SELECT EstudianteId FROM Estudiantes WHERE EstudianteId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });

        db.run('DELETE FROM Estudiantes WHERE EstudianteId = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, data: 'El estudiante se ha eliminado' });
        });
    });
});

module.exports = router;