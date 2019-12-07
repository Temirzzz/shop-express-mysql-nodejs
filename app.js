const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

app.listen(3001, () => {
    console.log('listen port 3001');    
});

app.get('/', (req,res) => {
    res.render('main', {
        foo : 4,
        bar : 7
    });
});