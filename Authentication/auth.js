const jwt = require('jsonwebtoken')

//Configurations
const config = require('../configuration.json')

//functions
function getToken(role,reg_id,res,next){
    jwt.sign({
        role: role,
        reg_id: reg_id
    },config.JWT_KEY,{
        algorithm:config.JWT_ALGO,
        expiresIn: config.JWT_EXP, 
    },(err,token)=>{
        if(!err){
            res.json({
                token
            })
        }
        else{
            next(err)
        }
    })
}

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

function verifyUser(req,res,next){
    const bearerHeader = req.headers.authorization;

    if(typeof bearerHeader !== 'undefined'){
        let [bearer,token] = bearerHeader.split(' ');
        if (bearer !== 'Bearer'){
            res.status(403);
            res.json({error: 'Accepting "Bearer" Token'});
        }
        else{
            //Authorization Code
            jwt.verify(token,config.JWT_KEY,{algorithms:[config.JWT_ALGO,]},
                (err,decoded)=>{
                    if (err != null){
                        res.status(403)
                        res.json({error:"Invalid token"})
                    }
                    else{
                        console.log("Decoded",decoded)
                        req.user = decoded;
                        console.log('Inside Decoded')
                        next();
                    }
            });
        }
    }
    else{
        res.status(403)
        res.json({error: 'Accepting Bearer Token'})
    }
}

module.exports = {getToken,verifyUser};