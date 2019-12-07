const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

/* подключаем модуль mysql */
let mysql = require('mysql');
/* настраиваем модуль mysql */
let con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '8512',
    database : 'shop'
});



app.listen(3001, () => {
    console.log('listen port 3001');    
});

app.get('/', (req,res) => {
    con.query(
        'SELECT * FROM goods',
        function (error, result) {
            if (error) throw error; 
            //console.log(result);      
            let goods = {};
            for (let i = 0; i < result.length; i++){
                goods[result[i]['id']] = result[i];
            }   
            //console.log(goods);    
            //console.log(JSON.parse(JSON.stringify(goods))); 
            res.render('main', {
                foo : 4,
                bar : 7,
                goods : JSON.parse(JSON.stringify(goods))
            });           
        }
    );    
});