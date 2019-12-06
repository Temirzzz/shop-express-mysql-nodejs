const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3001, () => {
    console.log('listen port 3001');    
});

app.get('/', (req,res) => {
    res.render('index.html');
});