# 📚 Colegio API - Node.js + Express

API REST para gestión académica desarrollada con **Node.js** y **Express**.

## 🔹 Funcionalidades

- 👨‍🎓 Gestión de Estudiantes  
- 👨‍🏫 Gestión de Maestros  
- 📘 Gestión de Materias  
- 📝 Gestión de Notas  

Los datos se almacenan en memoria (arrays).  
No utiliza base de datos.

---

# 📁 Estructura del Proyecto

```
colegio/
│
├── routes/
│   ├── estudiantes.js
│   ├── maestros.js
│   ├── materia.js
│   └── notas.js
│
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# 🚀 Instalación

⚠ El proyecto **NO incluye node_modules** porque está ignorado en `.gitignore`.

Para instalar correctamente:

```bash
git clone https://github.com/valeriaup/colegio.git
cd colegio
npm install
node index.js
```

Servidor corriendo en:

```
http://localhost:3000
```

---

# 📌 Base URL

```
http://localhost:3000/api
```

---

# 🔐 Autenticación

La API usa validación por headers.

## Para consultas (GET)

```
password: 12345
```

## Para crear, actualizar o eliminar (POST, PUT, DELETE)

```
password: 6789
x-user-role: admin
```

---

# 👨‍🎓 Endpoints - Estudiantes

### GET /api/estudiantes

Filtros opcionales:
- nombre
- apellido
- genero
- email

Ejemplo:
```
GET /api/estudiantes?nombre=ana
```

---

### GET /api/estudiantes/:id

Obtiene un estudiante por ID.

---

### POST /api/estudiantes

Body:

```json
{
  "nombre": "Juan",
  "apellido": "Lopez",
  "genero": "Masculino",
  "email": "juan@gmail.com"
}
```

---

### PUT /api/estudiantes/:id

Actualiza todos los campos del estudiante.

---

### DELETE /api/estudiantes/:id

Elimina un estudiante.

---

# 👨‍🏫 Endpoints - Maestros

### GET /api/maestros

Filtros:
- nombre
- apellido
- especialidad
- email
- telefono

---

### GET /api/maestros/:id

Obtiene maestro por ID.

---

### POST /api/maestros

```json
{
  "nombre": "Laura",
  "apellido": "Martinez",
  "especialidad": "Fisica",
  "email": "laura@gmail.com",
  "telefono": 3001234567
}
```

---

### PUT /api/maestros/:id

Actualiza maestro.

---

### DELETE /api/maestros/:id

Elimina maestro.

---

# 📘 Endpoints - Materias

### GET /api/materias

Filtros:
- nombre
- descripcion
- activa (true / false)

Ejemplo:
```
GET /api/materias?activa=true
```

---

### GET /api/materias/:id

Obtiene materia por ID.

---

### POST /api/materias

```json
{
  "nombre": "Historia",
  "descripcion": "Historia Universal",
  "activa": true
}
```

---

### PUT /api/materias/:id

Actualiza materia.

---

### DELETE /api/materias/:id

Elimina materia.

---

# 📝 Endpoints - Notas

Las notas relacionan:

- estudianteId
- profesorId
- materia
- valor

---

### GET /api/notas

Filtros:
- estudianteId
- profesorId
- materia
- valor

Ejemplo:
```
GET /api/notas?estudianteId=1
```

---

### GET /api/notas/:id

Obtiene nota por ID.

---

### POST /api/notas

```json
{
  "estudianteId": 1,
  "profesorId": 1,
  "materia": "Matematicas",
  "valor": 4.5
}
```

---

### PUT /api/notas/:id

Actualiza nota.

---

### DELETE /api/notas/:id

Elimina nota.

---

# 📦 Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado correctamente |
| 400 | Datos incompletos |
| 401 | API key requerida |
| 403 | No autorizado |
| 404 | No encontrado |

---

# ⚠ Consideraciones

- Los datos se pierden al reiniciar el servidor.
- No hay base de datos.
- No hay autenticación real (solo headers).
- Proyecto académico.