const express = require('express');
const router = express.Router();
const validarNuevoUsuario = require('../middlewares/validarNuevoUsuario');
const authController = require('../controller/authController');
const viewController = require('../controller/viewController');
const usersController = require('../controller/usersController');
const exportController = require('../controller/exportController')

// views
router.get('/', authController.isAuthenticated, viewController.paginaPrincipal);
router.get('/login', viewController.login);

// auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// api
router.get('/obtener-usuarios', authController.isAuthenticated, usersController.obtenerUsuarios);
router.get('/obtener-usuario/:email', authController.isAuthenticated, usersController.comprobarCorreo);
router.post('/nuevo-usuario', authController.isAuthenticated, validarNuevoUsuario, usersController.crearUsuario);
router.delete('/eliminar-usuario/:email', authController.isAuthenticated, usersController.eliminarUsuario);
router.patch('/editar-usuario/:email', authController.isAuthenticated, usersController.editarUsuario);
router.put('/cambiar-estado-usuario/:email', authController.isAuthenticated, usersController.cambiarEstadoUsuario);
router.get('/export', authController.isAuthenticated, exportController.exportar)

module.exports = router;
