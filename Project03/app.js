const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
path = require('path');
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/login',(req,res)=>{
    res.render('login');
});
app.get('/profile',isLogIn,(req,res)=>{
    res.render('login');
});
app.post('/register',async (req,res)=>{
     const {name,username,password,email,age} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send('User already registered');

    bcrypt.genSalt(10,(err,salt) =>{
        bcrypt.hash(password, salt ,async (err,hash) =>{
           const user = await userModel.create({
                name,
                username,
                email,
                password : hash,
                age
            });

            const token = jwt.sign({email:email, userid : user._id},"shhhhh");
            res.cookie("token" , token);
            res.send("registered")
        });
    });

});

app.post('/login',async (req,res)=>{
     const {name,username,password,email,age} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const token = jwt.sign({email:email, userid : user._id},"shhhhh");
            res.cookie("token" , token);
            return res.send("login successful");
        }
        else return res.redirect('/login');
    })

    

});

app.post('/login',async (req,res)=>{
     const {name,username,password,email,age} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result) return res.send("login successful");
        else return res.redirect('/login');
    })

    

});

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/login'); 

});

function isLogIn(req,res,next){
    if(req.cookies.token === "") return res.send('you must be login');
    else{
         const data = jwt.verify(req.cookies.token,"shhhhh");
         req.user = data;
         next();
    }
}


app.listen(3000);