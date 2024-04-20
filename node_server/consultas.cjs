const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const express = require("express");


const app = express();




// New Pool
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "angel",
  database: "softjobs",
  allowExitOnIdle: true,
});





// Insertar usuarios en DB
const agregarUsuarios = async (email, password, rol, lenguage) => {
  const passwordEncriptada = bcrypt.hashSync(password);
  const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
  const values = [email, passwordEncriptada, rol, lenguage];
  const { rowCount } = await pool.query(consulta, values);
  return rowCount;
};




// Autenticación de usuario
const autenticarUsuario = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const {rows, rowCount} = await pool.query(consulta, values);
  const passwordEncriptada = rows[0].password;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  const token = jwt.sign({ email }, "az_AZ", { expiresIn: "1h" })
  if (!passwordEsCorrecta || !rowCount)
    return false;
  return(token);
}



// Validar el token recibido en las cabeceras en la ruta
const verificarYdecodificar = async (token) => {
  jwt.verify(token, "az_AZ");
  const {email} = jwt.decode(token);
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const {rows, rowCount} = await pool.query(consulta, values);
  return(rows)
}

module.exports = {agregarUsuarios, autenticarUsuario, verificarYdecodificar}