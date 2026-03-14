require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const estudiantesRoutes = require('./routes/estudiantes');
const profesoresRoutes = require('./routes/maestros');
const materiasRoutes = require('./routes/materia');
const notasRoutes = require('./routes/notas');

app.use('/Api', estudiantesRoutes);
app.use('/Api', profesoresRoutes);
app.use('/Api', materiasRoutes);
app.use('/Api', notasRoutes);

app.get('/', (req, res) => {
    res.json({ success: true, message: "Bienvenido a la API del Proyecto 5 - Colegio (SENA)" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log(`Servidor corriendo en el puerto ${PORT}`);});