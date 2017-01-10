const express = require('express');
const app = express();
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.redirect('login.html');
})

