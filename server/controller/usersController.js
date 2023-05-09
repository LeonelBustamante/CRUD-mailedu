const db = require('../config/db-connection.js');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const { exec } = require('child_process');

require('dotenv').config();

const PAPELERA = process.env.PAPELERA;
const STORAGE = process.env.STORAGE;
const TABLA_USUARIO = process.env.DB_TABLE_USERS;


const errorServidor = "Error en el servidor"
const okServidor = "cambios en la base de datos"

function conexionBD(query, values, res) {
    db.query(query, values, (error, results, fields) => {
        if (error) { res.status(500).send(errorServidor) }
        else { res.status(200).send(okServidor); }
    });
}

exports.obtenerUsuarios = (req, res) => {
    db.query(`SELECT * FROM ${TABLA_USUARIO}`, (error, results, fields) => {
        if (error) { res.status(500).send(error) }
        else { res.status(200).send(results); }
    });
}

exports.crearUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const values = [nombre, apellido, dni, email, quota, password];

    const query = `INSERT INTO ${TABLA_USUARIO} 
    (nombre , apellido  , dni   , email , quota , password  ) VALUES 
    (?      , ?         , ?     , ?     , ?     , ?         )`;
    conexionBD(query, values, res);
    
    const value = `ENCRYPT(${password}, CONCAT('$6$', SUBSTRING(SHA(RAND()), -16)))`;
    const encryptQuery = `UPDATE ${TABLA_USUARIO} SET password = ? WHERE email = ?`;
    conexionBD(encryptQuery, [value, email], res);
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
    conexionBD(query, email, res);

    const username = email.split('@')[0];

    fs.rename(STORAGE + username, PAPELERA + username, (err) => {
        if (err) { res.status(500).send(errorServidor); }
        else { res.status(200).send(okServidor); }
    });
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


