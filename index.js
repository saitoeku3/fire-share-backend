'use strict'

const Busboy = require('busboy')
const express = require('express')
const errors = require('http-errors')
const fs = require('fs')
const logger = require('pino')()
const { ObjectId } = require('mongodb')
const os = require('os')
const path = require('path')
const wrap = require('./lib/wrap')

const app = express()

// FIXME: The server is stop if upload a file
app.use((req, res, next) => {
  if (req.method === 'POST') {
    const busboy = new Busboy({ headers: req.headers })
    const fileName = `${ObjectId().toString()}.txt`
    const filePath = path.join(os.tmpdir(), fileName)

    busboy.on('file', (fieldname, file) => {
      file.pipe(fs.createWriteStream(filePath))
      file.on('end', () => {
        req.file = { name: fileName, path: filePath }
      })
    })

    busboy.on('finish', () => {
      next()
    })

    req.pipe(busboy)
  }
})

app.post('/upload', wrap(require('./apis/upload').upload))

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
