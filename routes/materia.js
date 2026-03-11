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

// ── GET: todas las materias ───────────────────────────
router.get('/materias', authGet, (req, res) => {
    const { nombre, descripcion, activa } = req.query;

    let query = 'SELECT * FROM Materias WHERE 1=1';
    const params = [];

    if (nombre)      { query += ' AND Nombre LIKE ?';      params.push(`%${nombre}%`); }
    if (descripcion) { query += ' AND Descripcion LIKE ?'; params.push(`%${descripcion}%`); }
    if (activa !== undefined && activa !== '') {
        query += ' AND Activa = ?';
        // acepta tanto "true/false" como "1/0"
        params.push(activa === 'true' || activa === '1' ? 1 : 0);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows });
    });
});

// ── GET: materia por ID ───────────────────────────────
router.get('/materias/:id', authGet, (req, res) => {
    db.get('SELECT * FROM Materias WHERE MateriaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        res.json({ success: true, data: row });
    });
});

// ── POST: crear materia ───────────────────────────────
router.post('/materias', authAdmin, (req, res) => {
    const { nombre, descripcion, activa } = req.body;

    // Validación: campos obligatorios
    if (!nombre || activa === undefined) {
        return res.status(400).json({ success: false, message: 'nombre y activa son obligatorios' });
    }

    // Validación: activa debe ser booleano o 0/1
    const activaVal = activa === true || activa === 1 || activa === 'true' || activa === '1' ? 1 : 0;

    db.run(
        'INSERT INTO Materias (Nombre, Descripcion, Activa) VALUES (?, ?, ?)',
        [nombre, descripcion || null, activaVal],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, data: { id: this.lastID, nombre, descripcion, activa: activaVal } });
        }
    );
});

// ── PUT: actualizar materia ───────────────────────────
router.put('/materias/:id', authAdmin, (req, res) => {
    const { nombre, descripcion, activa } = req.body;

    // Validación: campos obligatorios
    if (!nombre || activa === undefined) {
        return res.status(400).json({ success: false, message: 'nombre y activa son obligatorios' });
    }

    // Validación: existe la materia
    db.get('SELECT MateriaId FROM Materias WHERE MateriaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });

        const activaVal = activa === true || activa === 1 || activa === 'true' || activa === '1' ? 1 : 0;

        db.run(
            'UPDATE Materias SET Nombre = ?, Descripcion = ?, Activa = ? WHERE MateriaId = ?',
            [nombre, descripcion || null, activaVal, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, data: { id: req.params.id, nombre, descripcion, activa: activaVal } });
            }
        );
    });
});

// ── DELETE: eliminar materia ──────────────────────────
router.delete('/materias/:id', authAdmin, (req, res) => {

    // Validación: existe la materia
    db.get('SELECT MateriaId FROM Materias WHERE MateriaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });

        db.run('DELETE FROM Materias WHERE MateriaId = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, data: 'La materia se ha eliminado' });
        });
    });
});

module.exports = router;