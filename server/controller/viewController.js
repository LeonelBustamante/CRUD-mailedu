const path = require('path');


exports.login = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login.html'));
}

exports.paginaPrincipal = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/home.html'));
}