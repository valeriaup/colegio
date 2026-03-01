const express = require('express');
const router = express.Router();

let materias = [
    { id: 1, nombre: 'Matemáticas', descripcion: 'Álgebra y Geometría', activa: false },
    { id: 2, nombre: 'Programación', descripcion: 'Node.js y APIs REST', activa: true },
    { id: 3, nombre: 'Quimica', descripcion: 'Nivel Técnico', activa: true }
];

// GET: todas las materias
router.get('/materias', (req, res) => {
    const apiKey = req.headers['password'];
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }
    if (apiKey !== '12345') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    const { nombre, descripcion, activa } = req.query;
    let filtradasMaterias = materias.filter(m => {
        return ((!nombre || m.nombre.toLocaleLowerCase().includes(nombre.toLocaleLowerCase()))) &&
               (!descripcion || m.descripcion.toLocaleLowerCase().includes(descripcion.toLocaleLowerCase())) &&
               (!activa || m.activa.toString() === activa.toLocaleLowerCase());
    });

    res.json({ success: true, Headers: { apiKey }, data: filtradasMaterias });
});

// GET: obtener una materia por ID
router.get('/materias/:id', (req, res) => {
    const apiKey = req.headers['password'];
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }
    if (apiKey !== '12345') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    const materia = materias.find(m => m.id === parseInt(req.params.id));
    if (!materia) {
        return res.status(404).json({ success: false, message: 'Materia no encontrada' });
    } else {
        res.json({ success: true, Headers: { apiKey }, data: materia });
    }
});

// POST: agregar materia
router.post('/materias', (req, res) => {
    const apiKey = req.headers['password'];
    const role = req.headers['x-user-role'];
   
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }
    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const { nombre, descripcion, activa } = req.body;
   
    if (!nombre || !descripcion || activa === undefined) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const newMateria = {
        id: materias.length + 1,
        nombre,
        descripcion,
        activa
    };
   
    materias.push(newMateria);
    res.status(201).json({ success: true, Headers: { apiKey, role }, data: newMateria });
});

// PUT: actualizar datos de la materia
router.put('/materias/:id', (req, res) => {
    const apiKey = req.headers['password'];
    const role = req.headers['x-user-role'];
   
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }
    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const id = parseInt(req.params.id);
    const { nombre, descripcion, activa } = req.body;
    const materia = materias.find(m => m.id === id);
   
    if (!materia) {
        return res.status(404).json({ success: false, message: 'Materia no encontrada' });
    }
   
    // Actualiza los campos
    materia.nombre = nombre;
    materia.descripcion = descripcion;
    materia.activa = activa;

    res.json({ success: true, Headers: { apiKey, role }, data: materia });
});

// DELETE: eliminar materia por ID
router.delete('/materias/:id', (req, res) => {
    const apiKey = req.headers['password'];
    const role = req.headers['x-user-role'];
   
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }
    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const materiaIndex = materias.findIndex(m => m.id === parseInt(req.params.id));
   
    if (materiaIndex === -1) {
        return res.status(404).json({ success: false, message: 'Materia no encontrada' });
    }
   
    materias.splice(materiaIndex, 1);
   
    res.status(201).json({ success: true, Headers: { apiKey, role }, data: "La materia se ha eliminado" });
});

module.exports = router;