const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Configuración de la base de datos MariaDB
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Cambia con tu usuario de MariaDB
  password: "", // Cambia con tu contraseña de MariaDB
  database: "comentarios_db",
});
// Conexión a la base de datos
db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos MariaDB");
});
// Endpoint para obtener los comentarios
app.get("/comentarios", (req, res) => {
  db.query("SELECT * FROM comentarios ORDER BY fecha DESC", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// Endpoint para agregar un comentario
app.post("/comentarios", (req, res) => {
  const { nombre, email, comentario } = req.body;
  const query =
    "INSERT INTO comentarios (nombre, email, comentario) VALUES (?, ?, ?)";
  db.query(query, [nombre, email, comentario], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, nombre, email, comentario });
  });
});
// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
