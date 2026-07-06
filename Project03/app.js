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
app.get('/profile',isLogIn,async (req,res)=>{
    const user = await userModel.findOne({email:req.user.email}).populate("posts");
   
    res.render("profile",{user});
});


app.get('/like/:id',isLogIn,async (req,res)=>{
    const post = await postModel.findOne({_id:req.params.id}).populate("user");

    if(post.like.indexOf(req.user.userid) === -1){
        post.like.push(req.user.userid);
    }else{
        post.like.splice(post.like.indexOf(req.user.userid),1);
    }
   
    await post.save();
    res.redirect("/profile");
});

app.get('/edit/:id',isLogIn,async (req,res)=>{
    const post = await postModel.findOne({_id:req.params.id}).populate("user");

    res.render("edit" ,{post});
});

app.post('/update/:id',isLogIn,async (req,res)=>{
    const post = await postModel.findOneAndUpdate({ _id: req.params.id}, { content: req.body.content });
    res.redirect("/profile");
});













app.post('/post',isLogIn,async (req,res)=>{
    const{content} = req.body;
    const user = await userModel.findOne({email:req.user.email});
    let post = await postModel.create({

    user:user._id,
    content
   })
   user.posts.push(post._id);
   await user.save();
    res.redirect("/profile");
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



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send("Invalid email or password");
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
            return res.redirect("/login");
        }

        const token = jwt.sign(
            { email: user.email, userid: user._id },
            "shhhhh"
        );

        res.cookie("token", token);
        res.redirect("/profile");
    });
});

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/login'); 

});

function isLogIn(req,res,next){
    if(req.cookies.token === "") return res.redirect('/login');
    else{
         let data = jwt.verify(req.cookies.token,"shhhhh");
         req.user = data;
         next();
    }
}


app.listen(3000);

