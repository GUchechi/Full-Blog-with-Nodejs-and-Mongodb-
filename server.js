const express = require('express');
const app = express();
const port = 7000;
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');


// DB connection

mongoose.connect("mongodb://localhost/MyBlog")
.then(response => console.log('Database Connected Successfully'))
.catch(error => console.log(`Database connection: ${error}`))


// Morgan setup
app.use(logger('dev'));

// setUp view engine to use EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Teling the server to use public folder

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

// Routers
app.get('/', (req, res) => {
    const allPosts = [
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            img: '/assets/images/image1.jpg',
            title: 'card title',
            content:"Some quick example text to build on the card title and make up the bulk of the card's content."
        },
    ];
    res.render('home', {allPosts});

});

app.get('/login', (req, res) => {
    res.render("login")
});

app.get('/newpost', (req, res) => {
    res.render("newpost")
});

app.get('/register', (req, res) => {
    res.render("register")
});  

app.post('/user/register', async (req, res) => {
    let{userName, password, confirmPassword, email, summary, image} = req.body;
    if(password.length < 6){
        console.log("Password must be greater than six")
    }else if( password != confirmPassword){
        console.log("password not the same")
    }
    let userExist = await User.findOne({email})
    if(userExist){
        console.log('User already exist')
    }else{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
        let newUser = new User({
            userName,
            password: hashedPassword,
            email,
            summary,
            image
        })
        newUser = await newUser.save();
        if(!newUser){
            console.log('Something went wrong')
        } else{
            console.log(`Registration Successful ${newUser}`)
        }
    }

});

app.listen(port,() => console.log(`server running on ${port}`));