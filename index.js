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

app.use(logger('dev'))

app.use((req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  const tmpdir = os.tmpdir()

  busboy.on('file', (fieldname, file) => {
    const id = ObjectId()
    const filePath = path.join(tmpdir, id)
    file.pipe(fs.createWriteStream(filePath))
    file.on('end', () => {})
  })
  req.pipe(busboy)
  next()
})

app.get('/', require(wrap('./apis/upload').upload))

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
