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
let reviews



fileReaderAsync(path.join(__dirname, 'accounts.json'))
    .then(data => {
        accounts = data;
        users = data.users;
    })
    .catch(error => {
        console.error('Error reading accounts file:', error);
    });

fileReaderAsync(path.join(__dirname, 'reviews.json'))
    .then(data => {
        reviews = data.reviews;
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

app.post('/watchlist/add', (req, res) => {
    const { userId, movieTitle } = req.body;
    const user = accounts.users.find(user => user.id === userId);

    if (user) {
        user.favmovies.push(movieTitle);
        fs.writeFile('backend/accounts.json', JSON.stringify(accounts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json({ message: 'Movie added to watchlist', favmovies: user.favmovies });
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


app.post('/watchlist/remove', (req, res) => {
    const { userId, movieTitle } = req.body;
    const user = accounts.users.find(user => user.id === userId);

    if (user) {
        user.favmovies = user.favmovies.filter(title => title !== movieTitle);
        fs.writeFile('backend/accounts.json', JSON.stringify(accounts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json({ message: 'Movie removed from watchlist', favmovies: user.favmovies });
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/reviews/add', (req, res) => {
    const newReview = req.body;
    //newReview.id = reviews.length + 1;
    reviews.push(newReview);
    console.log(reviews)
    fs.writeFile('backend/reviews.json', JSON.stringify(reviews, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Review added successfully', review: newReview });
    });
});


app.get(["/home", "/newuser", "/login"], (req, res) => {
    res.render("index")
})
app.get("/users", (req, res) => {
    res.send(users)
})



app.get("/logo", (req, res) => {
    res.sendFile(path.join(__dirname, 'logo.png'));
})

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        console.log(`http://localhost:${3000}/home`);
    });
} else {
    module.exports = app;
}