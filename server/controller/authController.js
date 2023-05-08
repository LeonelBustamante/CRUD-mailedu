const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../config/db-connection');
const { promisify } = require('util');

// Registrar nuevo usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const query = `INSERT INTO ${process.env.DB_TABLE} SET name = ?, user = ?, password = ?`
        let hashedPassword = await bcryptjs.hash(password, 8)
        const values = [name, email, hashedPassword];

        conexion.query(query, values, (error) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al registrar usuario');
            } else {
                res.redirect('/login');
            }
        });

    } catch (error) {
        console.log('Error en register', error);
        res.status(500).send('Error al registrar usuario');
    }
}

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("No se escribió el usuario o contraseña");
        } else {
            const query = `SELECT * FROM ${process.env.DB_TABLE_ADMIN} WHERE user = ?`
            conexion.query(query, email, async (error, results) => {

                if (error) {
                    console.log(error);
                    res.status(500).send('Error al iniciar sesión');
                } else if (results.length == 0 || !(await bcryptjs.compare(password, results[0].pass))) {
                    console.log("La contraseña es incorrecta");
                } else {
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    console.log("TOKEN: " + token + " para el USUARIO : " + email)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.redirect('/');
                }
            })
        }
    } catch (error) {
        console.log('Error en login', error);
        res.status(500).send('Error al iniciar sesión');
    }
}

// Verificar si el usuario está autenticado
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        console.log("logueado");
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query(`SELECT * FROM ${process.env.DB_TABLE_ADMIN} WHERE id = ?`, [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        console.log("no logueado");
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/login')
}
