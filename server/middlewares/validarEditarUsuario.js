const { body, validationResult } = require('express-validator');

const validarEditarUsuario = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isAlpha().withMessage('El nombre solo debe contener letras'),
    body('apellido').trim().notEmpty().withMessage('El apellido es requerido').isAlpha().withMessage('El apellido solo debe contener letras'),
    body('correo').trim().isEmail().withMessage('Ingrese un correo electrónico válido'),
    body('password').trim().isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('quota').isInt({ min: 0 }).withMessage('La quota debe ser un número entero positivo'),

    (req, res, next) => {
        console.log("***VALIDANDO LOS SIGUIENTES DATOS***\n", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } next();
    }
];

module.exports = validarEditarUsuario;
