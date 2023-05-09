const { body, validationResult } = require('express-validator');

const validarNuevoUsuario = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isAlpha().withMessage('El nombre solo debe contener letras'),
  body('apellido').trim().notEmpty().withMessage('El apellido es requerido').isAlpha().withMessage('El apellido solo debe contener letras'),
  body('dni').trim().notEmpty().withMessage('El dni es requerido'),
  body('email').trim().isEmail().withMessage('Ingrese un correo electrónico válido'),
  body('password').trim().isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json(errors); }
    next();
  }
];

module.exports = validarNuevoUsuario;
