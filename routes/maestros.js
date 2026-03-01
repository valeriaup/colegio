const express = require('express');
const router = express.Router();

const maestros = [
    { id: 1, nombre: 'Carlos', apellido: 'Perez', especialidad: 'Programacion', email: 'carlos@gmail.com', telefono: 8503658743},
    { id: 2, nombre: 'Melisa', apellido: 'Uribe', especialidad: 'Quimica', email: 'melisadiabla@gmail.com', telefono: 3789321904},
    { id: 3, nombre: 'Guillermo', apellido: 'Zuluaga', especialidad: 'Matematicas', email: 'guilleremito@gmail.com', telefono: 4363856815},
    { id: 4, nombre: 'Vicky', apellido: 'Gutierrez', especialidad: 'Investigacion', email: 'doñavicky@gmail.com', telefono: 5678910347}
];

//GET: todos los maestros
router.get('/maestros', (req, res) => {
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
    const { nombre, apellido, especialidad, email, telefono } = req.query;
    let filtradosMaestros = maestros.filter(p => {
        return((!nombre || p.nombre.toLocaleLowerCase().includes(nombre.toLocaleLowerCase()))) &&
        (!apellido || p.apellido.toLocaleLowerCase().includes(apellido.toLocaleLowerCase())) &&
        (!especialidad || p.especialidad.toLocaleLowerCase().includes(especialidad.toLocaleLowerCase())) &&
        (!email || p.email.toLocaleLowerCase().includes(email.toLocaleLowerCase())) &&
        (!telefono || p.telefono === Number(telefono))
    })
    res.json({ success: true, Headers: {apiKey}, data: filtradosMaestros });
});

// GET: obtener un estudiante por ID
router.get('/maestros/:id', (req, res) => {
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
    const teacher = maestros.find(u => u.id === parseInt(req.params.id));
    if (!teacher){
        return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
    } else {
        res.json({ success: true, Headers: {apiKey}, data: teacher });
    }
});

//POST: agregar maestro
router.post('/maestros', (req, res) => {
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
    const { nombre, apellido, especialidad, email, telefono} = req.body;
    if (!nombre || !apellido || !especialidad || !email || !telefono) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }
    const newMaestro = {
        id: maestros.length + 1,
        nombre,
        apellido,
        especialidad,
        email,
        telefono
    };
    maestros.push(newMaestro);
    res.status(201).json({ success: true, Headers: {apiKey, role}, data: newMaestro });
});

//PUT: actualizar datos
router.put('/maestros/:id', (req, res) => {
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
    const { nombre, apellido, especialidad, email, telefono} = req.body;
    const maestro = maestros.find(e => e.id === id);
    if (!maestro) {
        return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
    }
    // Actualiza los campos
    maestro.nombre = nombre;
    maestro.apellido = apellido;
    maestro.especialidad = especialidad;
    maestro.email = email;
    maestro.telefono = telefono

    res.json({ success: true, Headers: {apiKey, role}, data: maestro });
});

//DELETE: eliminar estudiante por ID
router.delete('/maestros/:id', (req, res) => {
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
    const teacher = maestros.findIndex(u => u.id === parseInt(req.params.id));
    if (teacher === -1) {
        return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
    }
    maestros.splice(teacher, 1);
    
    res.status(201).json({ success: true, Headers: {apiKey, role}, data: "El maestro se ha eliminado" });
});

module.exports = router;