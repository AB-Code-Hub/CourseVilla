const joi = require('joi')


exports.addCourseValidation = (validator) => {
    const addCourseValidationSchema = joi.object({
        userId: joi.string(),
        title: joi.string().required(),
        description: joi.string().required(),
        category: joi.string().required(),
        price: joi.string().required(),
        image: joi.string().optional().allow(null).allow(""),
        discount: joi.string().optional().allow(null).allow(""),
        videos: joi.string().optional().allow(null).allow(""),
        topic: joi.string().optional().allow(null).allow(""),
        duration: joi.string().optional().allow(null).allow(""), 
    })
    return addCourseValidationSchema.validate(validator)
}

exports.updateCourseValidation = (validator) => {
    const updateCourseValidationSchema = joi.object({
        name: joi.string().optional().allow(null).allow(""),
        description: joi.string().optional().allow(null).allow(""),
        price: joi.string().optional().allow(null).allow(""),
        image: joi.string().optional().allow(null).allow(""),
        discount: joi.string().optional().allow(null).allow(""),
        videos: joi.string().optional().allow(null).allow(""),
        topics: joi.string().optional().allow(null).allow(""),
        duration: joi.array().optional().allow(null).allow(""),
    })
    return updateCourseValidationSchema.validate(validator)
}

