const Joi = require('joi');

const signupValidation = (req,res,next)=>{
    const schema = Joi.object({
        firstname: Joi.string().min(1).max(100).required(),
        lastname: Joi.string().min(1).max(100).required(),
        email: Joi.string().email().required(),
        age: Joi.number().integer().min(1).max(100).required(),
        contactnumber: Joi.string().pattern(/^\d{10}$/).required(),
        password: Joi.string().min(4).max(100).required()
    });
    
    const {error} = schema.validate(req.body);
    if (error)
    {
        return res.status(400)
            .json({message: "Bad Request",error})
    }
    next();
}


const loginValidation = (req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const {error} = schema.validate(req.body);
    if (error)
    {
        return res.status(400)
            .json({message: "Bad Request",error})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}