const connection = require('../config/db-connection.js');
require('dotenv').config();

const obtenerUsuarios = (req, res) => {
    connection.query(`SELECT * FROM ${process.env.USUARIOS}`, function (error, results, fields) {
        if (error) throw error;
        res.send(results)
    });
}
const crearUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const values = [nombre, apellido, dni, email, quota, password];

    const query = `
    INSERT INTO ${process.env.USUARIOS} 
    (nombre, apellido, dni, email, quota, password) 
    VALUES 
    (?, ?, ?, ?, ?, ENCRYPT(?, CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))))`;


    console.log(query);
    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error(`Error insertando usuario: ${error} `);
            res.status(500).send('Error al insertar el usuario.');
        } else {
            console.log(`Usuario insertado con ID: ${results.insertId} `);
            res.status(200).send('Usuario insertado correctamente.');
        }
    });
}



const desactivarUsuario = (req, res) => {
    const { email } = req.params;

    const query = `UPDATE ${process.env.USUARIOS} SET activo = 0 WHERE email = ? `;
    const values = [email];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error(`Error desactivando usuario: ${error} `);
            res.status(500).send('Error al desactivar el usuario.');
        } else {
            console.log(`Usuario desactivado con ID: ${id} `);
            res.status(200).send('Usuario desactivado correctamente.');
        }
    });
}


module.exports = { obtenerUsuarios, crearUsuario, desactivarUsuario }; 