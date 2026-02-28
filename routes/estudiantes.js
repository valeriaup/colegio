const express = require('express');
const router = express.Router();

const estudiantes = [
    { id: 1, nombre: 'Ana', apellido: 'Gómez', genero: 'Femenino', email: 'anagomez@gmail.com'},
    { id: 2, nombre: 'Pedro', apellido: 'Correa', genero: 'Masculino', email: 'pedrocorreita@gmail.com'},
    { id: 3, nombre: 'Sara', apellido: 'Bolivar', genero: 'Femenino', email: 'sarabolivar@gmail.com'}
];

//GET: todos los estudiantes
router.get('/estudiantes', (req, res) => {
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
    const { nombre, apellido, genero, email} = req.query;
    let filtradosEstudiantes = estudiantes.filter(p => {
        return((!nombre || p.nombre.toLocaleLowerCase().includes(nombre.toLocaleLowerCase()))) &&
        (!apellido || p.apellido.toLocaleLowerCase().includes(apellido.toLocaleLowerCase())) &&
        (!genero || p.genero.toLocaleLowerCase().includes(genero.toLocaleLowerCase())) &&
        (!email || p.email.toLocaleLowerCase().includes(email.toLocaleLowerCase()))
    })
    res.json({ success: true, Headers: {apiKey}, data: filtradosEstudiantes });
});

// GET: obtener un estudiante por ID
router.get('/estudiantes/:id', (req, res) => {
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
    const estudent = estudiantes.find(u => u.id === parseInt(req.params.id));
    if (!estudent) {
        return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    } else {
        res.json({ success: true, Headers: {apiKey}, data: estudent });
    }
});

//POST: agregar estudiante
router.post('/estudiantes', (req, res) => {
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
    const { nombre, apellido, genero, email} = req.body;
    if (!nombre || !apellido || !genero || !email) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }
    const newEstudiante = {
        id: estudiantes.length + 1,
        nombre,
        apellido,
        genero,
        email,
    };
    estudiantes.push(newEstudiante);
    res.status(201).json({ success: true, Headers: {apiKey, role}, data: newEstudiante });
});

//PUT: actualizar datos
router.put('/estudiantes/:id', (req, res) => {
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
    const { nombre, apellido, genero, email } = req.body;
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) {
        return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    // Actualiza los campos
    estudiante.nombre = nombre;
    estudiante.apellido = apellido;
    estudiante.genero = genero;
    estudiante.email = email;

    res.json({ success: true, Headers: {apiKey, role}, data: estudiante });
});

//DELETE: eliminar estudiante por ID
router.delete('/estudiantes/:id', (req, res) => {
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
    const student = estudiantes.findIndex(u => u.id === parseInt(req.params.id));
    if (student === -1) {
        return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    estudiantes.splice(student, 1);
    
    res.status(201).json({ success: true, Headers: {apiKey, role}, data: "El estudiante se ha eliminado" });
});

module.exports = router;