const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../config/db-connection');
const { promisify } = require('util');

const TABLA_ADMIN = process.env.DB_TABLE_ADMIN;

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const query = `INSERT INTO ${TABLA_ADMIN} SET name = ?, user = ?, password = ?`
    let hashedPassword = await bcryptjs.hash(password, 8)
    const values = [name, email, hashedPassword];

    db.query(query, values, (error) => {
        if (error) { res.status(500).send('Error al registrar usuario'); }
        else { res.redirect('/login'); }
    });

}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        console.log('❌ No se ha logueado correctamente');
        res.status(400).send('Por favor ingrese usuario y contraseña')
    } else {
        const query = `SELECT * FROM ${TABLA_ADMIN} WHERE user = ?`

        db.query(query, email, async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(password, results[0].pass))) {
                console.log(`❌ El usuario ${email} no se ha logueado correctamente`);
                res.status(401).send('Usuario o contraseña incorrectos')

            } else {
                const id = results[0].id
                const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                })
                const cookiesOptions = {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookiesOptions)

                console.log(`✅ El usuario ${email} se ha logueado correctamente`);
                res.status(200).writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 200, message: 'Usuario logueado correctamente' }));
            }
        })

    }
}

exports.isAuthenticated = async (req, res, next) => {
    console.log("isAuth", req.body);
    if (req.cookies.jwt) {
        console.log(`✅ logueado`);
        const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
        db.query(`SELECT * FROM ${TABLA_ADMIN} WHERE id = ? `, [decodificada.id], (error, results) => {
            if (!results) { return next() }
            req.user = results[0]
            return next()
        })
    } else {
        console.log('No se ha logueado correctamente');
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    console.log(`❌ logueado`);
    res.clearCookie('jwt')
    return res.redirect('/login')
}
