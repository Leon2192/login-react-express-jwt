const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const TOKEN_KEY = "x4TvnErxRETbVcqaL15dqMI115eN1p5y";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader);
  if (token == null) return res.status(401).send("Token requerido");

  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.status(402).send("Token inválido");
    console.log(user);
    req.user = user;
    next();
  });
};

app.post("/usuario/login", (req, res) => {
  const usuario = req.body.usuario;
  const clave = req.body.clave;
  if (usuario === "larrieta" && clave === "12345") {
    const datos = {
      id: "123",
      nombre: "Leonardo Arrieta",
      email: "larrieta@gmail.com",
      codigo: "asdfg",
    };
    const token = jwt.sign(
      {
        userId: datos.id,
        email: datos.email,
      },
      TOKEN_KEY,
      { expiresIn: "2h" }
    );
    let nDatos = { ...datos, token };
    res.status(200).json(nDatos);
  } else {
    res.status(400).send("Credenciales son inválidas.");
  }
});

app.get("/usuario/:id/ventas", verifyToken, (req, res) => {
  const datos = [
    {
      id: 1,
      cliente: "Empresa A",
      total: 2000,
      fecha: "2022-11-15",
    },
    {
      id: 2,
      cliente: "Empresa C",
      total: 4700,
      fecha: "2022-12-23",
    },
    {
      id: 3,
      cliente: "Empresa F",
      total: 3000,
      fecha: "2023-01-15",
    },
  ];
  res.json(datos);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
