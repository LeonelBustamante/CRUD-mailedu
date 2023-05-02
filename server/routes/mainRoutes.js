const express = require('express');
const router = express.Router();
const validarNuevoUsuario = require('../middlewares/validarNuevoUsuario');
const validarEditarUsuario = require('../middlewares/validarEditarUsuario');
const { obtenerUsuarios, crearUsuario, editarUsuario, eliminarUsuario, cambiarEstadoUsuario, login } = require('../controllers/mainController');

router.delete('/eliminar-usuario/:email', eliminarUsuario);
router.get('/obtener-usuario', obtenerUsuarios);
router.post('/nuevo-usuario', validarNuevoUsuario, crearUsuario);
router.patch('/editar-usuario/:email', validarEditarUsuario, editarUsuario);
router.put('/cambiar-estado-usuario/:email', cambiarEstadoUsuario);

router.post('/login', login);

module.exports = router;
