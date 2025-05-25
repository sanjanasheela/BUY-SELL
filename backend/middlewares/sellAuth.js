const Joi = require('joi');


const sellItemValidation = (req, res, next) => {
    
    const schema = Joi.object({
        
        itemname: Joi.string().min(1).max(100).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().min(1).max(1000).required(),
        category: Joi.array().items(Joi.string()).required(),
        sellerid: Joi.string().required(), // valid Mongo ObjectId
        
    });
    console.log('verified');
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message
        });
    }

    next();
};

module.exports = sellItemValidation;
