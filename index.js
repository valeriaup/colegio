const express = require('express');
const app = express();
const port = 3000;

const estudiantesRoute = require('./routes/estudiantes')

app.use(express.json());
app.use('/api', estudiantesRoute);

app.listen(port, () => { console.log("Server esta arriba " + port) });