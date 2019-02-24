'use strict'

const firebase = require('firebase-admin')
const firebaseAdminKey = require('../firebaseAdminKey.json')

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseAdminKey),
  storageBucket: `${firebaseAdminKey.project_id}.appspot.com`
})

module.exports = firebase
