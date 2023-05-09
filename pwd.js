const crypto = require('crypto');

const password = 'prueba';
const salt = '$6$' + crypto.randomBytes(16).toString('hex').substring(-16);
const encryptedPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

console.log(salt + encryptedPassword);
