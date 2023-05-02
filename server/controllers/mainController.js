const connection = require('../config/db-connection.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const errorServidor = "Error en el servidor"
const okServidor = "cambios en la base de datos"

const obtenerUsuarios = (req, res) => {
    connection.query(`SELECT * FROM ${process.env.USUARIOS}`, (error, results, fields) => {
        if (error) { res.status(500).send(errorServidor) }
        else { res.status(200).send(results); }
    });
}

const crearUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const values = [nombre, apellido, dni, email, quota, password];

    const query = `
        INSERT INTO ${process.env.USUARIOS} 
        (nombre , apellido  , dni   , email , quota , password  ) VALUES 
        (?      , ?         , ?     , ?     , ?     , ?         )  `;

    conexionBD(query, values, res);
}

const editarUsuario = (req, res) => {
    const { nombre, apellido, dni, email, quota, password } = req.body;
    const values = [nombre, apellido, dni, email, quota, password];

    const query = `
        UPDATE ${process.env.USUARIOS} SET
        nombre = ?, apellido = ?, dni = ?, email = ?, quota = ?, password = ?
        WHERE 
        email = ?`;

    conexionBD(query, values, res);
}

const eliminarUsuario = (req, res) => {
    const values = req.params.email;
    const query = `DELETE FROM ${process.env.USUARIOS} WHERE email = ?`;
    conexionBD(query, values, res);
}

const cambiarEstadoUsuario = (req, res) => {
    let email = req.params.email;

    connection.query(`SELECT activo FROM ${process.env.USUARIOS} WHERE email = ?`, [email], (error, results, fields) => {
        if (error) {
            res.status(500).send(errorServidor)
        } else {
            let estadoActual = results[0].activo;
            if (estadoActual == 1) { estadoActual = 0; }
            else { estadoActual = 1; }

            const values = [estadoActual, email];
            const query = `UPDATE ${process.env.USUARIOS} SET activo = ? WHERE email = ?`;
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

async function login(req, res) {
    const { email, password } = req.body;
    let pwdHash = await bcrypt.hash(password, 8);
    if (email && pwdHash) {
        connection.query('SELECT * FROM users WHERE email = ?', [email],
            async (error, results, fields) => {
                if (results.length > 0) {
                    let comparacion = await bcrypt.compare(password, results[0].password);

                    if (comparacion) {
                        console.log("login exitoso");
                        req.session.loggedin = true;
                        req.session.email = email;
                        res.redirect('/home');
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }
                    res.end();
                } else {
                    res.send('Please enter Username and Password!');
                    res.end();
                }
            }
        );
    }
}

function homeLoader(req, res) {
    res.sendFile(path.join(__dirname, '../public/home.html'));
}

function logout(req, res) {
    req.session.destroy();
    res.redirect('/');
}
module.exports = { obtenerUsuarios, crearUsuario, cambiarEstadoUsuario, eliminarUsuario, editarUsuario, login, homeLoader, logout };