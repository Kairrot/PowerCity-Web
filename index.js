require('./src/app').listen(8081, () => {
    console.log("Serveur lancer")
})

require('dotenv').config();