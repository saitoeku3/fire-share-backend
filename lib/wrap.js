'use strict'

const assert = require('assert')

const wrap = fn => (req, res, next) => {
  assert.strictEqual(
    fn.constructor.name,
    'AsyncFunction',
    `${fn.name} id not assignable to type 'AsyncFunstion'`
  )

  fn(req, res, next)
    .then(data => {
      res.status(200, data)
    })
    .catch(next)
}

module.exports = wrap
