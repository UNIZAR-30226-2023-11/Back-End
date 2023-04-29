const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var usersRouter = require('./routes/users');
var partidaRouter = require('./routes/partida');
const app = express();
const apiPort = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Monopoly versión informática - Susan L. Graham');
// })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/users', usersRouter);
app.use('/partida', partidaRouter)


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
