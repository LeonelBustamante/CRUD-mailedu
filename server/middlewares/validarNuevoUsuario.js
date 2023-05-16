const { body, validationResult } = require('express-validator');

const validarNuevoUsuario = [
  body('nombre').toUpperCase().trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellido').toUpperCase().trim().notEmpty().withMessage('El apellido es requerido'),
  body('dni').trim().notEmpty().withMessage('El dni es requerido'),
  body('email').toLowerCase().trim().isEmail().withMessage('Ingrese un correo electrónico válido'),
  body('password').trim().isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

  (req, res, next) => {
    console.log("********validacion", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) { console.log(errors); return res.status(400).json(errors); }
    console.log("********validacionNext", req.body);
    next();
  }
];

module.exports = validarNuevoUsuario;
