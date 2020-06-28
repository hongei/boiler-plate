const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;//10자리인 salt

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email: {
        type : String,
        trim : true,
        unique : 1
    },
    password:{
        type : String,
        minlength : 5
    },
    lastname: {
        type : String,
        maxlength : 50
    },
    role: {
        type : Number,
        default : 0
    },
    image: String,
    token: {
        type : String
    },
    tokenExp: {
        type : Number
    }
});

//password를 변경 하였을때만 암호화 한다.
userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        //비밀번호를 암호화 한다.(bcrypt 사용)
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                //password를 hash로 바꿔 준다.
                user.password = hash;
                next();
            });
        });
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
