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


exports.updateUserValidation = (validator) => {
    const updateUserValidationSchema = joi.object({
        firstName: joi.string().trim().min(3).allow(null, "").messages({'string.empty': 'First name cannot be empty or just white spaces'}),
        lastName: joi.string().allow(null, ""),
        email: joi.string().trim().allow(null, ""),
        password: joi.string().trim().min(6).allow(null, ""),
        role: joi.string().allow(null, ""),
    })
    return updateUserValidationSchema.validate(validator)
}

exports.AddUserValidation = (validator) => {
    const AddUserValidationSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required().allow(null).allow(""),
        email: joi.string().required(),
        password: joi.string().required(),
        role: joi.string().required()
    })
    return AddUserValidationSchema.validate(validator)
}