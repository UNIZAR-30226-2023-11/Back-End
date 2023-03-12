const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var usersRouter = require('./app_server/routes/users');

const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Monopoly versión informática - Susan L. Graham');
})

app.use('/users', usersRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));