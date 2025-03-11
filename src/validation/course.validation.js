const joi = require('joi')


exports.addCourseValidation = (validator) => {
    const addCourseValidationSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required().allow(null).allow(""),
        email: joi.string().required(),
        password: joi.string().required(),
    })
    return addCourseValidationSchema.validate(validator)
}




exports.updateCourseValidation = (validator) => {
    const updateCourseValidationSchema = joi.object({
        firstName: joi.string().trim().min(3).messages({'string.empty': 'First name cannot be empty or just white spaces'}),
        lastName: joi.string().allow(null).allow(""),
        email: joi.string().trim(),
        password: joi.string().trim().min(6),
    })
    return updateCourseValidationSchema.validate(validator)
}