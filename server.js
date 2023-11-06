const express = require('express');
const ejs = require('ejs');
const {connectMongoose} = require('./config/database');
const {User} = require('./models/userSchema');
const passport = require('passport');
const {initializingPassport} = require('./config/passport');
const {isAuthenticated} = require('./middleware/auth');
const expressSession = require('express-session');

const app = express();

//db call
connectMongoose();

//passport fn call
initializingPassport(passport);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware to use passportjs
app.use(expressSession({
    secret:'secret',  //this is a random string that will be used to sign the session id cookie
    resave: false,
    saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

//view engine ejs
app.set('view engine', 'ejs');

//home
app.get('/', (req, res) => {
    // res.send("Hello World");
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/login', (req, res) => {
    res.render('login');
});

//register
app.post('/register', async(req, res) => {
    try {
        const {username, password, name} = req.body;
        const user = await User.findOne({ username: username });
        if(user){
            return res.status(409).json({message:"Username already exists"})
        }else{
            const newUser = await User.create({username, password, name});
            return res.status(201).json({message:"Registered Successfully"});
        }
        
    } catch (error) {
        console.log(error);
    }
    
});
//login
app.post('/login', passport.authenticate('local', {failureRedirect: '/register', successRedirect: '/profile'}))

app.get('/profile', isAuthenticated, (req, res) => {
    res.send(req.user);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})