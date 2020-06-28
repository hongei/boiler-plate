const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require('./models/User');
const mongoose = require('mongoose');
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false    
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 안녕하세요! nodemon으로 실행 하였습니다.'))

app.post('/register', (req,res) => {
  //회원가입에 필요한 정보를 client에서 얻어온 데이터를 데이터베이스에 저장 한다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({success:false, err});
    return res.status(200).json({success:true});
  });

});

app.post('/login', (req,res) => {
  
  //1. 요청된 이메일을 데이터베이스에 있는지 확인
  User.findOne({email:req.body.email}, (err, user) =>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공 된 이메일에 해당 하는 유저가 없습니다."
      });
    }

    //2. 요청된 이메일이 데이터베이스에 있으면 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({
          loginSuccess:false,
          message: "비밀번호가 틀렸습니다."
        });
      }

      //3. 비밀번호가 같으면 토큰 생성 
      user.generateToken((err, user) => {
        if(err){
          res.status(400).send(err);
        }

        // 토큰을 저장 한다.(쿠키, 로컬스토리지 등 저장 가능)
        res.cookie('x_auth', user.token)
        .status(200)
        .json({
          loginSuccess: true, userId: user._id
        });
      });//generateToken
    });//comparePassword
  });//findOne
});//post

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));