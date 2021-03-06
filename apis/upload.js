'use strict'

const axios = require('axios')
const dayjs = require('dayjs')
const firebase = require('../lib/firebase')
const bucket = firebase.storage().bucket()

const upload = async req => {
  const { filepath } = req.file
  const [filename] = filepath.match(/[0-9a-z.?]+\.[a-z]+/)
  const dateAfterOneWeek = dayjs(new Date()).add(7, 'day')

  await bucket.upload(filepath)

  const [signedUrl] = await bucket
    .file(filename)
    .getSignedUrl({ action: 'read', expires: dateAfterOneWeek })

  const { data } = await axios.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`,
    {
      dynamicLinkInfo: {
        domainUriPrefix: 'https://fireshare.page.link',
        link: signedUrl
      }
    }
  )

  return { url: data.shortLink }
}

exports.upload = upload
