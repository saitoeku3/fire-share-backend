'use strict'

const express = require('express')
const errors = require('http-errors')
const logger = require('pino')()
const wrap = require('./lib/wrap')

const app = express()

// app.use((req, res, next) => {
//   const busboy = new Busboy({ headers: req.headers })
//   const tmpdir = os.tmpdir()

//   busboy.on('file', (fieldname, file) => {
//     const id = ObjectId()
//     const filePath = path.join(tmpdir, id)
//     file.pipe(fs.createWriteStream(filePath))
//     file.on('end', () => {})
//   })
//   req.pipe(busboy)
//   next()
// })

app.get('/upload', wrap(require('./apis/upload').upload))

app.use((req, res, next) => {
  next(new errors.NotFound())
})

app.use((err, req, res) => {
  const code = err.statusCode || 500
  logger.error(err)
  res.status(code).json({
    code: code,
    error: err.message
  })
})

app.listen(3000)
