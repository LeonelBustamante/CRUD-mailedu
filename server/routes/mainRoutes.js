const express = require('express');
const router = express.Router();
const validarNuevoUsuario = require('../middlewares/validarNuevoUsuario');
const validarEditarUsuario = require('../middlewares/validarEditarUsuario');
const { crearUsuario, obtenerUsuarios, editarUsuario, eliminarUsuario } = require('../controllers/mainController.js');

// get página principal
router.get('obtener-usuarios', obtenerUsuarios);

// post nuevo usuario
router.post('nuevo-usuario', validarNuevoUsuario, crearUsuario);

// patch editar usuario
router.patch('editar-usuario/:id', validarEditarUsuario, editarUsuario);

// delete eliminar usuario
router.delete('eliminar-usuario/:id', eliminarUsuario);

module.exports = router;
