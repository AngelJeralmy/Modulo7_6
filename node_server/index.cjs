const express = require("express");
const cors = require('cors'); 

const app = express();
const port = 3000;

// Servidor encendido
app.listen(port, () => {
  console.log("¡Servidor encendido! en puerto: " + port);
});

const { agregarUsuarios, autenticarUsuario, verificarYdecodificar} = require("./consultas.cjs");







// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors({origin: 'http://localhost:5173', allowedHeaders: ['Authorization', 'Content-Type'],}));







// Middleware para verificar credenciales
const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios' });
  }
  next();
};






// POST-Usuarios
app.post("/usuarios", verificarCredenciales, async (req, res) => {
  try {
    console.log("Solicitud POST recibida en /usuarios");/* Reportar por la terminal las consultas recibidas en el servidor */
    const { email, password, rol, lenguage } = req.body;
    const answer = await agregarUsuarios (email, password, rol, lenguage);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
  res.send("Éxito al resgistrar.")
});






// POST-login
app.post("/login", verificarCredenciales, async (req, res) => {
  try {
    console.log("Solicitud POST recibida en /login");/* Reportar por la terminal las consultas recibidas en el servidor */
    const {email, password} = req.body;
    const answer = await autenticarUsuario (email, password);
    if(!answer){
      res.send("Credenciales incorrectas.");
    }
    res.send(answer);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});






// GET-usuarios
app.get("/usuarios", async (req, res) => {
  try{
    console.log("Solicitud GET recibida en /usuarios"); /*Reportar por la terminal las consultas recibidas en el servidor */
    const Authorization = req.header("Authorization"); 
    const token = Authorization.split("Bearer ")[1];
    const answer = await verificarYdecodificar (token);
    if(!answer){
      res.send("No se ha podido verificar.");
    }else{
      const usuario = answer[0];
      const usuarioFormateado = {
        email: usuario.email,
        rol: usuario.rol,
        lenguage: usuario.lenguage
      };
      res.send(usuarioFormateado);
      console.log("Enviado.")
    }
  }catch (error) {
    res.status(error.code || 500).send(error);
  }
})
