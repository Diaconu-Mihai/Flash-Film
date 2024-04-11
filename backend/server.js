const express = require('express');
const app = express();

app.set('view engine', 'ejs')

app.use(express.static('frontend'));

app.get(["/", "/newuser"], (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
