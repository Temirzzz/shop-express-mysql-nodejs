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

app.use(express.json());



app.listen(3001, () => {
    console.log('listen port 3001');    
});

app.get('/', (req,res) => {
    let cat = new Promise((resolve,reject) =>{
        con.query (
            "select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3",
            function (error, result, fields) {
                if (error) return reject(error);
                resolve(result)
            }
        );
    });
    let catDescription = new Promise((resolve,reject) =>{
        con.query (
            "SELECT * FROM category",
            function (error, result, fields) {
                if (error) return reject(error)
                resolve(result)
            }
        );
    });
    Promise.all([cat, catDescription]).then((value) => {
        console.log(value[0]);        
        res.render('index', {
            goods : JSON.parse(JSON.stringify(value[0])),
            cat : JSON.parse(JSON.stringify(value[1]))
        })
    });
});


app.get('/cat', (req,res) => {
    //console.log(req.query.id);    
    let catid = req.query.id;     
    let cat = new Promise((resolve,reject)=>{
        con.query(
            'SELECT * FROM category WHERE id='+catid,
            function (error, result) {
                if (error) reject (error); 
                resolve(result);                 
            });
    });

    let goods = new Promise((resolve,reject)=>{
        con.query(
            'SELECT * FROM goods WHERE category='+catid,
            function (error, result) {
                if (error) reject (error); 
                resolve(result);                 
            });
    });

    Promise.all([cat, goods]).then((value)=>{
        //console.log(value[0]);   
        res.render('cat', {
            cat : JSON.parse(JSON.stringify(value[0])),
            goods : JSON.parse(JSON.stringify(value[1]))
        });        
    })    
});

app.get('/goods', (req,res) => {
    //console.log(req.query.id);    
    con.query('SELECT * FROM goods WHERE id='+req.query.id, (error, result, fields)=>{
        if (error) throw error;
        res.render('goods', {goods: JSON.parse(JSON.stringify(result))});
    });
});

app.get('/order', (req,res) => {     
        res.render('order');
});

app.post('/get-category-list', (req,res) => {
    //console.log(req.body);
    con.query('SELECT id, category FROM category', (error, result, fields)=>{
        if (error) throw error;
        //console.log(result);
        res.json(result);        
    });
});

app.post('/get-goods-info', (req,res) => {
    console.log(req.body.key);
    if (req.body.key.length !=0){   
        con.query('SELECT id, name, cost FROM goods WHERE id IN ('+req.body.key.join(',')+')', (error, result, fields)=>{
            if (error) throw error;   
            console.log(result);                    
            let goods = {}; 
            for (let i = 0; i < result.length; i++){
                goods[result[i]['id']] = result[i];
            }  
            res.json(goods);  
        });
    }
    else {
        res.send('0');
    }
});

app.post('/finish-order', (req,res) => {
    console.log(req.body);    
    if (req.body.key.length != 0) {
        let key = Object.keys(req.body.key);
        con.query('SELECT id, name, cost FROM goods WHERE id IN ('+ key.join(',')+')', 
        (error, result, fields) => {
            if (error) throw error;
            sendMail(req.body, result).catch(console.error);
            res.send('1');
        }); 
    }
    else {
        res.send('0');
    }
    
});

function sendMail (data, result) {
    
}