const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
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


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));