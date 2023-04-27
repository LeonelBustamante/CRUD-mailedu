const express = require('express');
const router = express.Router();
const validarNuevoUsuario = require('../middlewares/validarNuevoUsuario');
//const validarEditarUsuario = require('../middlewares/validarEditarUsuario');
const { crearUsuario, obtenerUsuarios, } = require('../controllers/mainController.js');

router.get('/obtener-usuario', obtenerUsuarios);

router.post('/nuevo-usuario', validarNuevoUsuario, crearUsuario);

//router.patch('/editar-usuario/:email', validarEditarUsuario, editarUsuario);

//router.delete('/eliminar-usuario/:email', eliminarUsuario);

//router.patch('/desactivar-usuario/:email', desactivarUsuario);

module.exports = router;
