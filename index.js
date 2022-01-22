import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.APP_PORT;

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
})

/* Personne endpoints */


/* Inscription endpoints*/


/* Ecolage endpoints */


/* Cours endpoints */


/* Facturation endpoints */


app.listen(port, () => {
    console.log(`Application démarré sur le port ${port}`)
})