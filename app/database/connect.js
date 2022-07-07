const mongoose = require('mongoose')

const mongoSetup = (url) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Database connected...'))
    .catch(() => console.log("Database failed to connect"))
}

module.exports = mongoSetup