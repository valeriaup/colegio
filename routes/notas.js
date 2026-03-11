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

// ── GET: todas las notas ──────────────────────────────
router.get('/notas', authGet, (req, res) => {
    const { estudianteId, profesorid, materiaId, valor } = req.query;

    let query = 'SELECT * FROM Notas WHERE 1=1';
    const params = [];

    if (estudianteId) { query += ' AND EstudianteId = ?'; params.push(parseInt(estudianteId)); }
    if (profesorid)   { query += ' AND ProfesorId = ?';   params.push(parseInt(profesorid)); }
    if (materiaId)    { query += ' AND MateriaId = ?';    params.push(parseInt(materiaId)); }
    if (valor)        { query += ' AND Valor = ?';        params.push(parseFloat(valor)); }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows });
    });
});

// ── GET: nota por ID ──────────────────────────────────
router.get('/notas/:id', authGet, (req, res) => {
    db.get('SELECT * FROM Notas WHERE NotaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });
        res.json({ success: true, data: row });
    });
});

// ── POST: crear nota ──────────────────────────────────
router.post('/notas', authAdmin, (req, res) => {
    const { estudianteId, profesorid, materiaId, valor } = req.body;

    // Validación: campos obligatorios
    if (!estudianteId || !profesorid || !materiaId || !valor) {
        return res.status(400).json({ success: false, message: 'estudianteId, profesorid, materiaId y valor son obligatorios' });
    }

    // Validación: valor debe ser número entre 0 y 5
    if (isNaN(valor) || valor <= 0 || valor > 5) {
        return res.status(400).json({ success: false, message: 'valor debe ser un número entre 0.1 y 5' });
    }

    // Validación: el estudiante existe
    db.get('SELECT EstudianteId FROM Estudiantes WHERE EstudianteId = ?', [estudianteId], (err, est) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!est) return res.status(404).json({ success: false, message: 'El estudiante no existe' });

        // Validación: el profesor existe
        db.get('SELECT ProfesorId FROM Profesores WHERE ProfesorId = ?', [profesorid], (err, prof) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (!prof) return res.status(404).json({ success: false, message: 'El profesor no existe' });

            // Validación: la materia existe
            db.get('SELECT MateriaId FROM Materias WHERE MateriaId = ?', [materiaId], (err, mat) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                if (!mat) return res.status(404).json({ success: false, message: 'La materia no existe' });

                db.run(
                    'INSERT INTO Notas (EstudianteId, ProfesorId, MateriaId, Valor) VALUES (?, ?, ?, ?)',
                    [estudianteId, profesorid, materiaId, valor],
                    function (err) {
                        if (err) return res.status(500).json({ success: false, message: err.message });
                        res.status(201).json({ success: true, data: { id: this.lastID, estudianteId, profesorid, materiaId, valor } });
                    }
                );
            });
        });
    });
});

// ── PUT: actualizar nota ──────────────────────────────
router.put('/notas/:id', authAdmin, (req, res) => {
    const { estudianteId, profesorid, materiaId, valor } = req.body;

    // Validación: campos obligatorios
    if (!estudianteId || !profesorid || !materiaId || !valor) {
        return res.status(400).json({ success: false, message: 'estudianteId, profesorid, materiaId y valor son obligatorios' });
    }

    // Validación: valor debe ser número entre 0 y 5
    if (isNaN(valor) || valor <= 0 || valor > 5) {
        return res.status(400).json({ success: false, message: 'valor debe ser un número entre 0.1 y 5' });
    }

    // Validación: existe la nota
    db.get('SELECT NotaId FROM Notas WHERE NotaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });

        db.run(
            'UPDATE Notas SET EstudianteId = ?, ProfesorId = ?, MateriaId = ?, Valor = ? WHERE NotaId = ?',
            [estudianteId, profesorid, materiaId, valor, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, data: { id: req.params.id, estudianteId, profesorid, materiaId, valor } });
            }
        );
    });
});

// ── DELETE: eliminar nota ─────────────────────────────
router.delete('/notas/:id', authAdmin, (req, res) => {

    // Validación: existe la nota
    db.get('SELECT NotaId FROM Notas WHERE NotaId = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });

        db.run('DELETE FROM Notas WHERE NotaId = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, data: 'La nota se ha eliminado' });
        });
    });
});

module.exports = router;