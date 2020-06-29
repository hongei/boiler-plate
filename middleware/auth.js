const User = require("../models/User");

let auth = (req, res, next) => {

    //인증 처리
    // 1. 클라이언트 쿠키에서 토큰을 얻어 온다.
    var token = req.cookie;

    // 2. 토큰을 복호화 한 후 user를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err){
            throw err;
        }

        if(!user){
            return res.json({
                "isAuth":false, 
                "error":true
            });
        }

        req.token = token;
        req.user = user;
        next();
    })//findByToken


    // 3. 유저가 있으면 

    // 4. 유저가 없으면

};

module.exports = {auth};