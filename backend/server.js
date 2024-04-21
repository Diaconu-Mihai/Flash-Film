const express = require('express')
const app = express()
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const fs = require('fs');
const fileReaderAsync = require("./fileReader");


app.set('view engine', 'ejs')
app.use(express.static('frontend'))
app.use(expressLayouts)
app.use(bodyParser.json())

let accounts
let users
let admins


fileReaderAsync(path.join(__dirname, 'accounts.json'))
    .then(data => {
        accounts = data;
        users = data.users;
        admins = data.admins;
    })
    .catch(error => {
        console.error('Error reading accounts file:', error);
    });

app.post('/newuser', (req, res) => {
    const newUser = req.body;
    newUser.id = accounts.users.length + 1;
    accounts.users.push(newUser);
    fs.writeFile('backend/accounts.json', JSON.stringify(accounts, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'User created successfully', user: newUser });
    })
})





app.get(["/", "/newuser"], (req, res) => {
    res.render("index")
})
app.get("/admins", (req, res) => {
    res.send(admins)
})
app.get("/users", (req, res) => {
    res.send(users)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})