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

router.get('/materias', authGet, (req, res) => {
    const { nombre, descripcion, activa } = req.query;

    let query = 'SELECT * FROM Materias WHERE 1=1';
    const params = [];

    if (nombre) { query += ' AND Nombre LIKE ?'; params.push(`%${nombre}%`); }
    if (descripcion) { query += ' AND Descripcion LIKE ?'; params.push(`%${descripcion}%`); }
    if (activa !== undefined && activa !== '') {
        query += ' AND Activa = ?';
        params.push(activa === 'true' || activa === '1' ? 1 : 0);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows });
    });
});

router.get('/materias/:id', authGet, (req, res) => {
    db.get('SELECT * FROM Materias WHERE MateriaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        res.json({ success: true, data: row });
    });
});

router.post('/materias', authAdmin, (req, res) => {
    const { nombre, descripcion, activa } = req.body;

    if (!nombre || activa === undefined) {
        return res.status(400).json({ success: false, message: 'nombre y activa son obligatorios' });
    }

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

router.put('/materias/:id', authAdmin, (req, res) => {
    const { nombre, descripcion, activa } = req.body;

    if (!nombre || activa === undefined) {
        return res.status(400).json({ success: false, message: 'nombre y activa son obligatorios' });
    }

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

router.delete('/materias/:id', authAdmin, (req, res) => {
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