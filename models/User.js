const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;//10자리인 salt
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    "name": {
        type : String,
        maxlength : 50
    },
    "email": {
        type : String,
        trim : true,
        unique : 1
    },
    "password":{
        type : String,
        minlength : 5
    },
    "lastname": {
        type : String,
        maxlength : 50
    },
    "role": {
        type : Number,
        default : 0
    },
    "image": String,
    "token": {
        type : String
    },
    "tokenExp": {
        type : Number
    }
});//userSchema

//password를 변경 하였을때만 암호화 한다.
userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        //비밀번호를 암호화 한다.(bcrypt 사용)
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err){
                return next(err);
            } 

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err){
                    return next(err);
                } 
                //password를 hash로 바꿔 준다.
                user.password = hash;
                next();
            });
        });
    }else{
        next();    
    }
});//pre

userSchema.methods.comparePassword = function(plainPassword, callback){
    //plainPassword : 1234567 / 암호화 된 비밀번호 : $2b$10$q9D8v.KYGAf2OXugCIxvMeb5ggA1nG5q4aSp5vZMUS7miM6BnZ.mW
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err){
            return callback(err);
        }
        return callback(null, isMatch);
    });//compare
}//comparePassword

userSchema.methods.generateToken = function(callback){
    var user = this;
    
    //jsonwebtoken 이용해서 토큰을 생성 한다/
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    //user._id + 'secretToken' = token -> 'secretToken' -> user._id
    user.token = token;
    user.save(function(err, user){
        if(err){
            return callback(err);
        }
        
        return callback(null, user);
    });//save
}//generateToken

userSchema.statics.findByToken = function(token, callback){
    var user = this;

    // user._id + '' = token;
    //토큰을 decode(복호화) 한다.
    jwt.verify(token, secretToken, function(err, decoded){
        //userId를 이용하여 유저를 찾은 다음 클라이언트에서 가져온 token과 DB의 token을 비교한다.
        user.findOne({"_id": decoded, "token":token}, function(err, user){
            if(err){
                return callback(err);
            }else{
                callback(null, user);
            }
        });
    });//verify
}//findByToken

const User = mongoose.model('User', userSchema);

module.exports = {User};
