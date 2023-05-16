const db = require('../config/db-connection.js');
const fs = require('fs-extra');
const ssha = require("ssha");
const { exec } = require('node:child_process');



require('dotenv').config();

const PAPELERA = process.env.PAPELERA;
const STORAGE = process.env.STORAGE;
const TABLA_USUARIO = process.env.DB_TABLE_USERS;


const errorServidor = "Error en el servidor"
const okServidor = "cambios en la base de datos"

function conexionBD(query, values, res) {
    db.query(query, values, (error, results, fields) => {
        console.log("--------------------");
        console.log("Query: ", query);
        console.log("Values: ", values);
        console.log("Error: ", error ? error : "No hay errores");
        console.log("Results: ", results);
        console.log("--------------------");
        if (error) { res.status(500).send(errorServidor) }
        else { res.status(200).send(okServidor); }
    });
}

exports.obtenerUsuarios = (req, res) => {
    console.log("obteniendo usuarios");
    db.query(`SELECT * FROM ${TABLA_USUARIO}`, (error, results, fields) => {
        if (error) { res.status(500).send(error) }
        else { res.status(200).send(results); }
    });
}
exports.comprobarCorreo = (req, res) => {
    console.log("compobando correo");
    const param = req.params.email;
    const query = `SELECT email FROM ${TABLA_USUARIO} WHERE email = ?`;
    db.query(query, param, (error, results, fields) => {
        console.log("--------------------");
        console.log("Query: ", query);
        console.log("Values: ", param);
        console.log("Error: ", error ? error : "No hay errores");
        console.log("Results: ", results);
        console.log("--------------------");
        if (error) { res.status(500).send(error) }
        else {
            console.log("results: ", results);
            console.log("results: ", results.typeof);
            res.status(200).send(results);
        }
    });
}


exports.crearUsuario = (req, res) => {
    console.log("creando usuario: ", req.body);
    const { nombre, apellido, dni, email, quota, password } = req.body;
    let hashPassword = ssha.create(password);
    const values = [nombre, apellido, dni, email, quota, hashPassword];


    const query = `INSERT INTO ${TABLA_USUARIO} 
    (domain_id, nombre , apellido  , dni   , email , quota , password, activo  ) VALUES 
    (1        , ?      , ?         , ?     , ?     , ?     , ?       , 1       )`;
    conexionBD(query, values, res)
}

exports.editarUsuario = (req, res) => {
    const param = req.params.email;
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const campos = [];
    const values = [];

    if (nombre) { campos.push('nombre = ?'); values.push(nombre); }
    if (apellido) { campos.push('apellido = ?'); values.push(apellido); }
    if (dni) { campos.push('dni = ?'); values.push(dni); }
    if (email) { campos.push('email = ?'); values.push(email); }
    if (quota) { campos.push('quota = ?'); values.push(quota); }
    if (password) { campos.push('password = ?'); values.push(password); }

    const query = `UPDATE ${TABLA_USUARIO} SET
    ${campos.join(', ')} WHERE 
    email = ? `;

    values.push(param);

    conexionBD(query, values, res);
}

exports.eliminarUsuario = (req, res) => {
    const email = req.params.email;
    const query = `DELETE FROM ${TABLA_USUARIO} WHERE email = ?`;
    db.query(query, email, () => { });

    const username = email.split('@')[0];
    let moveShell = `mv ${STORAGE}${username} ${PAPELERA}${username}`;
    console.log(moveShell);
    exec(moveShell)

}


exports.cambiarEstadoUsuario = (req, res) => {
    let email = req.params.email;

    db.query(`SELECT activo FROM ${TABLA_USUARIO} WHERE email = ?`, [email], (error, results, fields) => {
        if (error) { res.status(500).send(errorServidor) }
        else {
            let estadoActual = results[0].activo == 1 ? 0 : 1;
            const query = `UPDATE ${TABLA_USUARIO} SET activo = ? WHERE email = ?`;
            const values = [estadoActual, email];
            conexionBD(query, values, res);
        }
    });
}


