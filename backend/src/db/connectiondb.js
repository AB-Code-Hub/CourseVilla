const mongoose = require('mongoose')

exports.connectionDB = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/worldwar')
        .then((res) => console.log("Database Connected") )
        .catch((error) => {
            console.error("Disconnected", error)
        })
    }
    catch(error){
        console.log("Error",error)
    }
}