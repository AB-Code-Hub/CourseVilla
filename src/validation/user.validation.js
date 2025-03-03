const joi = require('joi')


exports.createUserValidation = (validator) => {
    const createUserValidationSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required().allow(null).allow(""),
        email: joi.string().required(),
        password: joi.string().required(),
    })
    return createUserValidationSchema.validate(validator)
}

exports.loginUserValidation = (validator) => {
    const loginUserValidationSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
    })
    return loginUserValidationSchema.validate(validator)
}