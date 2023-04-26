const connection = require('../config/db-connection.js');
require('dotenv').config();

let crearUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;

    const query = `INSERT INTO ${process.env.USUARIOS} ( nombre, apellido, dni, email, quota, password) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [nombre, apellido, dni, email, quota, password];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error(`Error insertando usuario: ${error}`);
            res.status(500).send('Error al insertar el usuario.');
        } else {
            console.log(`Usuario insertado con ID: ${results.insertId}`);
            res.status(200).send('Usuario insertado correctamente.');
        }
    });
}

let obtenerUsuarios = (req, res) => {
    connection.query(`SELECT * FROM ${process.env.USUARIOS}`, function (error, results, fields) {
        if (error) throw error;
        res.send(results)
    });
}


let editarUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const { id } = req.params;

    const query = `UPDATE ${process.env.USUARIOS} SET nombre = ?, apellido = ?, dni = ?, email = ?, quota = ?, password = ? WHERE id = ?`;
    const values = [nombre, apellido, dni, email, quota, password, id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error(`Error actualizando usuario: ${error}`);
            res.status(500).send('Error al actualizar el usuario.');
        } else {
            console.log(`Usuario actualizado con ID: ${id}`);
            res.status(200).send('Usuario actualizado correctamente.');
        }
    });
}

let eliminarUsuario = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM ${process.env.USUARIOS} WHERE id = ?`;
    const values = [id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error(`Error eliminando usuario: ${error}`);
            res.status(500).send('Error al eliminar el usuario.');
        } else {
            console.log(`Usuario eliminado con ID: ${id}`);
            res.status(200).send('Usuario eliminado correctamente.');
        }
    });
}

module.exports = { crearUsuario, obtenerUsuarios, editarUsuario, eliminarUsuario }; 