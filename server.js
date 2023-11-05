const express = require('express');
const ejs = require('ejs');
const {connectMongoose} = require('./config/database');
const {User} = require('./models/userSchema');

const app = express();

//db call
connectMongoose();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})