const { request, response } = require('express');
const express = require('express');
const app = express();
const { Routes } = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'citas'  
});

//middleware.- 
app.use(express.json());//leer e interpretar archivos en formato json
app.use(express.urlencoded());//encriptar la url hacia el servidor y evitar inyeccion de codigos maliciosos
connection.connect((error) => {
    if (error) throw error;
    console.log('Conexion exitosa');
});
//function mensaje(valor){
//    console.log(valor);
//}

//peticiones web : metodo: 
//get= enviar informacion, recuperar datos
//post=  put/patch, delete
//

//rutas
app.get('/',(req, res) => {
    res.send("Ruta principal del proyecto");
});

app.get('/pacientes', (req, res) => {
    connection.query('SELECT * FROM datos_pac', (error, resultados) =>{
        if (error) throw error;
        if (resultados.length > 0) {
            res.json(resultados);
        } else {
            res.send('no hay registros a mostrar');
        }
    });
    //res.send('metodos para ingresar un producto');
});
app.get('/mostrarpac/:id', (req, res) => {
    const {id } = req.params;
    let sql = `SELECT * FROM datos_pac where id = ${id}`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0){
            res.json(resultado);
    }else{
        res.send('Ese Paciente  no se encuentra registrado');
    }
    });
});

app.post('/agregarpac',(req, res) =>{
    let sql = 'INSERT INTO datos_pac SET ?';
    const dataObject = {
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        edad: req.body.edad,
        sintomas: req.body.sintomas
    };
    connection.query(sql, dataObject, (error) =>{
        if(error) throw error;
        res.send('Datos del Paciente insertado correctamente');
    })
}); 

app.put('/modificarpac/:id', (req, res) => {
    const {id } = req.params;
    const {nombre, cedula,edad,sintomas} = req.body;
    const sql = `UPDATE datos_pac SET nombre = '${nombre}', cedula = '${cedula}',edad = ${edad},sintomas ='${sintomas}' WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Datos del Paciente modificado correctamente');
    });

});

app.delete('/eliminarpac/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM datos_pac WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Datos del paciente borrado');
    });
});



//levaantar servidor
app.listen(4500, (req, res) => {
    console.log("Servidor corriendo ");
});

