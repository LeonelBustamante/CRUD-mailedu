const express = require('express');
const router = express.Router();
const validarNuevoUsuario = require('../middlewares/validarNuevoUsuario');
const validarEditarUsuario = require('../middlewares/validarEditarUsuario');
const { obtenerUsuarios, crearUsuario, editarUsuario, eliminarUsuario, cambiarEstadoUsuario, login, homeLoader, logout } = require('../controllers/mainController');

router.post('/login', login);


router.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
});

router.delete('/eliminar-usuario/:email', eliminarUsuario);
router.get('/obtener-usuario', obtenerUsuarios);
router.post('/nuevo-usuario', validarNuevoUsuario, crearUsuario);
router.patch('/editar-usuario/:email', validarEditarUsuario, editarUsuario);
router.put('/cambiar-estado-usuario/:email', cambiarEstadoUsuario);
router.get('/home', homeLoader);
router.get('/logout', logout);


module.exports = router;
