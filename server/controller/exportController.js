const db = require('../config/db-connection')
var data_exporter = require('json2csv').Parser;


const TABLA_USUARIO = process.env.DB_TABLE_USERS;

exports.exportar = (req, res, next) => {
    db.query(`SELECT nombre, apellido, dni, quota, activo, email FROM ${TABLA_USUARIO}`, (error, data) => {
        var mysql_data = JSON.parse(JSON.stringify(data));
        var file_header = ['nombre', 'apellido', 'dni', 'quota', 'activo', 'email'];
        var json_data = new data_exporter({ file_header });
        var csv_data = json_data.parse(mysql_data);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=usuarios.csv");
        res.status(200).end(csv_data);
    });
}