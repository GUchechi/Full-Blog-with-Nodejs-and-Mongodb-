const express = require('express');
const app = express();
const port = 7000;
const logger = require('morgan');
const path = require('path'); 
const flash = require('connect-flash');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Post = require('./models/Post.js');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { globalVariables } = require('./config/globalConfig');
const passport = require ('passport'); 
const LocalStrategy = require ('passport-local').Strategy;
const {isLoggedIn} = require('./config/authorization') 
const multer  = require('multer'); 
const cloudinary = require('cloudinary').v2;

// Setting Up Multer
const storage = multer.diskStorage({
    filename: function( req, file, callback) {
        callback(null, Date.now + file.originalname)
    }
});
const upload = multer({ storage: storage })

// SetUp Cloudinary upload

cloudinary.config({
    cloud_name: 'dwjjwyahu',
    api_key: '477949661957967',
    api_secret: 'k4OhhSILFuZM1uEjKyMURyv9sT0'
});
   
// DB connection

mongoose.connect("mongodb://localhost/MyBlog") 
    .then(response => console.log('Database Connected Successfully'))
    .catch(error => console.log(`Database connection: ${error}`))    
    
    // cookie configuration
    app.use(cookieParser())


    // Session configuration
    app.use(session({
        secret: 'qqqqqhw5ttt3gwgwwhhjwujwiw8hywhikekeeuooiww34435%^%$@hekeieejjhhdd',
        resave: true,
        saveUninitialized : true,
        cookie:{
            maxAge: Date.now() + 3600000
        },
        store: MongoStore.create({
          mongoUrl: 'mongodb://localhost/MyBlog',
          ttl: 365 * 24 * 60 * 60 // =  Default
        })
      })); 

    //   Passport configuration
      app.use(passport.initialize());
      app.use(passport.session());
      passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, 
      async (req, email, password, done) => {
          await User.findOne({email})
          .then((user) => {
              if(!user) {
              return done(null, false, req.flash('error-message', 'User not found. Please register and try again'));
              }
              bcrypt.compare(password, user.password, (err, passwordMatch) => {
                  if(err){
                      return err;
                  }
                  if(!passwordMatch) 
                  return done(null, false, req.flash('error-message', 'Incorrect password'))
                  return done(null, user, req.flash('success-message', 'Login Successful'));
              })
          })
      }));
      
    //   Serialize User passport
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize User passport
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })


    //   Flash setup
    app.use(flash());

    // global Variables setup
    app.use(globalVariables);



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

// Post route for login
app.post('/user/login', passport.authenticate('local' , {
    failureRedirect: '/login',
    successRedirect: '/',
    session: true
}))
// route for post
app.get('/newpost', (req, res) => {
    res.render("newpost") 
});

app.post('/newpost', isLoggedIn, upload.single('mediafile'), async (req, res) => {
    let { title, content } = req.body;
    let mediaType = '';
    if (req.file.mimetype === 'video/mp4') {
        mediaType = 'video';        
    } else {
        mediaType = 'image';
    }

    const uploadedFile = await cloudinary.uploader.upload(req.file.path);
    if (!uploadedFile) {
        req.flash("error-message", "Error while uploading file!!!");
            return res.redirect("back")

        }
         // Create a new instance for a new post
         let newPost = new Post({
            title, 
            content,
            mediaType,
            mediaFile: uploadedFile.secure_url         
         });
            await newPost.save();

            req.flash('success-message', 'successfully uploaded');
            res.redirect('back') 
    });

    // Create Route for view Post

app.get('/viewpost', (req, res) => {  
    res.render("viewpost") 
}); 

app.get('/register', (req, res) => {
    res.render("register")
});    

app.post('/user/register', async (req, res) => {
    let { username,
         password,
         confirmPassword,
         email,
         summary,
         image
        } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist){
            req.flash("error-message", "User already exists");
            return res.redirect("back");
        }

        // hash password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = new User({
          username,
          password: hashedPassword,
          email,
          summary,
          image
      });

      await newUser.save();
      req.flash('success-message', 'Registration successful');
      res.redirect('/login')

});

// Log Out route

app.get('/user/logout', (req, res) => {
    req.logout( function(err){
        if(err) return next (err)
        req.flash("success-message", "User logged out successfully")
        res.redirect('/login')
    })
    
})
// User profile route
app.get('/user/profile', isLoggedIn, (req, res) => {
    res.render("profile")
});

app.listen(port,() => console.log(`server running on ${port}`));  