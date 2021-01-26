require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
//referenced on Jan 25,20201 by MM
//https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
//which led me to:
//http://expressjs.com/en/api.html#req.params
//referenced on Jan 25,20201 by MM
app.get('/mars-rovers-latest-img', async (req, res) => {
    let getRoverName = req.query.rover;
     try {
         let latestImages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${getRoverName}/latest_photos?api_key=${process.env.API_KEY}`)
         .then(res => res.json())
         res.send({ latestImages })
     } catch (err) {
         console.log('error:', err);
     }
 })

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`))