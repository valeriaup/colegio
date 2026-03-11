const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error conectando:', err.message);
  } else {
    console.log('Base de datos conectada');
  }
});

// Activar soporte de llaves foráneas en SQLite
db.run('PRAGMA foreign_keys = ON');

// ── TABLA 1: Estudiantes ──────────────────────────────
db.run(`CREATE TABLE IF NOT EXISTS Estudiantes (
  EstudianteId INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre       TEXT    NOT NULL,
  Apellido     TEXT    NOT NULL,
  Genero       TEXT    NOT NULL,
  Email        TEXT    NOT NULL UNIQUE
)`);

// ── TABLA 2: Profesores ───────────────────────────────
db.run(`CREATE TABLE IF NOT EXISTS Profesores (
  ProfesorId   INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre       TEXT    NOT NULL,
  Apellido     TEXT    NOT NULL,
  Especialidad TEXT    NOT NULL,
  Email        TEXT    NOT NULL UNIQUE,
  Telefono     TEXT    NOT NULL
)`);

// ── TABLA 3: Materias ─────────────────────────────────
db.run(`CREATE TABLE IF NOT EXISTS Materias (
  MateriaId    INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre       TEXT    NOT NULL,
  Descripcion  TEXT,
  Activa       INTEGER NOT NULL DEFAULT 1 CHECK(Activa = 0 OR Activa = 1)
)`);

// ── TABLA 4: Notas ────────────────────────────────────
// Depende de Estudiantes, Profesores y Materias
// Por eso se crea de ÚLTIMA
db.run(`CREATE TABLE IF NOT EXISTS Notas (
  NotaId        INTEGER PRIMARY KEY AUTOINCREMENT,
  EstudianteId  INTEGER NOT NULL,
  ProfesorId    INTEGER NOT NULL,
  MateriaId     INTEGER NOT NULL,
  Valor         REAL    NOT NULL CHECK(Valor > 0 AND Valor <= 5),
  FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId),
  FOREIGN KEY (ProfesorId)   REFERENCES Profesores(ProfesorId),
  FOREIGN KEY (MateriaId)    REFERENCES Materias(MateriaId)
)`);

module.exports = db;