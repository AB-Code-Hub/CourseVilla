exports.generateOTP =  () => {
    const digits = "0123456789"
    let otp=""
     while(otp.length < 6){
        const randomIndex = Math.floor(Math.random() * digits.length)
        const randomdigits = digits[randomIndex]

        if(!otp.includes(randomdigits)){
            otp += randomdigits
        }
     }
     
     return otp
}