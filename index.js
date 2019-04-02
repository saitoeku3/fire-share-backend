'use strict'

const Busboy = require('busboy')
const express = require('express')
const errors = require('http-errors')
const fs = require('fs')
const logger = require('morgan')
const { ObjectId } = require('mongodb')
const os = require('os')
const path = require('path')
const wrap = require('./lib/wrap')

const app = express()

app.use(logger('dev'))
app.use((req, res, next) => {
  if (req.method === 'POST') {
    const busboy = new Busboy({ headers: req.headers })

    busboy.on('file', (fieldname, file, filename) => {
      const ext = filename.match(/\.[a-z]+$/)
      const filepath = path.join(os.tmpdir(), `${ObjectId().toString()}${ext}`)
      file.pipe(fs.createWriteStream(filepath))
      file.on('end', () => {
        req.file = { filepath }
        next()
      })
    })
    req.pipe(busboy)
  } else {
    next()
  }
})

app.post('/upload', wrap(require('./apis/upload').upload))

app.use((req, res, next) => {
  next(new errors.NotFound())
})

app.use((err, req, res) => {
  const code = err.statusCode || 500
  res.status(code).json({
    code: code,
    error: err.message
  })
})

app.listen(3000)
