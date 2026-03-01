const express = require('express');
const app = express();
const port = 3000;

const estudiantesRoute = require('./routes/estudiantes');
const maestrosRoute = require('./routes/maestros');
const materiasRoute = require('./routes/materia')

app.use(express.json());
app.use('/api', estudiantesRoute);
app.use('/api', maestrosRoute);
app.use('/api', materiasRoute)

app.listen(port, () => { console.log("Server esta arriba " + port) });