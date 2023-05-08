const connection = require('../config/db-connection.js');
const fs = require('fs');
const papelera = "/vmail/neuquen.edu.ar/papelera";
const storage = "/vmail/neuquen.edu.ar/";

require('dotenv').config();

const errorServidor = "Error en el servidor"
const okServidor = "cambios en la base de datos"

exports.obtenerUsuarios = (req, res) => {
    connection.query(`SELECT * FROM ${process.env.DB_TABLE_USERS}`, (error, results, fields) => {
        if (error) { res.status(500).send(error) }
        else { res.status(200).send(results); }
    });
}

exports.crearUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const values = [nombre, apellido, dni, email, quota, password];

    const query = `
        INSERT INTO ${process.env.DB_TABLE_USERS} 
        (nombre , apellido  , dni   , email , quota , password  ) VALUES 
        (?      , ?         , ?     , ?     , ?     , ?         )  `;

    conexionBD(query, values, res);
}

exports.editarUsuario = (req, res) => {
    const param = req.params.email;
    console.log(req.body);
    console.log(req.params);
    const updateFields = [];
    const queryParams = [];

    if (req.body.nombre) {
        updateFields.push('nombre = ?');
        queryParams.push(req.body.nombre);
    }

    if (req.body.apellido) {
        updateFields.push('apellido = ?');
        queryParams.push(req.body.apellido);
    }

    if (req.body.dni) {
        updateFields.push('dni = ?');
        queryParams.push(req.body.dni);
    }

    if (req.body.email) {
        updateFields.push('email = ?');
        queryParams.push(req.body.email);
    }

    if (req.body.quota) {
        updateFields.push('quota = ?');
        queryParams.push(req.body.quota);
    }

    if (req.body.password) {
        updateFields.push('password = ?');
        queryParams.push(req.body.password);
    }

    const updateQuery = `
      UPDATE ${process.env.DB_TABLE_USERS} SET
      ${updateFields.join(', ')}
      WHERE 
      email = ?
    `;

    queryParams.push(param);

    conexionBD(updateQuery, queryParams, res);
}

exports.eliminarUsuario = (req, res) => {
    const values = req.params.email;
    const query = `DELETE FROM ${process.env.DB_TABLE_USERS} WHERE email = ?`;
    conexionBD(query, values, res);
    const username = values.split('@')[0];

    fs.rename(storage + username, papelera + username, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully renamed the directory.");
        }
    });
}

exports.cambiarEstadoUsuario = (req, res) => {
    let email = req.params.email;

    connection.query(`SELECT activo FROM ${process.env.DB_TABLE_USERS} WHERE email = ?`, [email], (error, results, fields) => {
        if (error) {
            res.status(500).send(errorServidor)
        } else {
            let estadoActual = results[0].activo;
            if (estadoActual == 1) { estadoActual = 0; }
            else { estadoActual = 1; }

            const values = [estadoActual, email];
            const query = `UPDATE ${process.env.DB_TABLE_USERS} SET activo = ? WHERE email = ?`;
            conexionBD(query, values, res);
        }
    });
}


function conexionBD(query, values, res) {
    connection.query(query, values, (error, results, fields) => {
        if (error) { res.status(500).send(errorServidor) }
        else { res.status(200).send(okServidor); }
    });
}
