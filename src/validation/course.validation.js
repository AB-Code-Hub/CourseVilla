const joi = require('joi')


exports.addCourseValidation = (validator) => {
    const addCourseValidationSchema = joi.object({
        userId: joi.string(),
        name: joi.string().required().allow(null).allow(""),
        description: joi.string().optional().allow(null).allow(""),
        price: joi.string().required(),
        image: joi.string().required(),
        discount: joi.string().optional().allow(null).allow(""),
        videos: joi.string().optional().allow(null).allow(""),
        topics: joi.string().optional().allow(null).allow(""),
        duration: joi.array().optional().allow(null).allow(""),
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


// {
//     userId: {
//       type: String,
//       default: null,
//     },

//     name: {
//       type: String,
//       default: null,
//     },
//     description: {
//       type: String,
//       default: null,
//     },
//     price: {
//       type: Number,
//       deafult: null,
//     },
//     discount: {
//       type: String,
//       default: null,
//     },
//     duration: {
//       type: String,
//       default: null,
//     },
//     topics: {
//       type: String,
//       default: null,
//     },
//     videos: [
//       {
//         type: Array,
//         default: null,
//       },
//     ],
//   },