const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const { google } = require('googleapis')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

const credentials = require('./credentials.json')

const { client_secret, client_id, redirect_uris } = credentials.web

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
)

app.get('/auth/google', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload']
  })

  res.redirect(authUrl)
})

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code

  const { tokens } = await oAuth2Client.getToken(code)

  oAuth2Client.setCredentials(tokens)

  fs.writeFileSync('token.json', JSON.stringify(tokens))

  res.send('Login berhasil')
})

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const tokens = JSON.parse(fs.readFileSync('token.json'))

    oAuth2Client.setCredentials(tokens)

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client
    })

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: req.body.title,
          description: req.body.description,
          tags: ['upload', 'youtube'],
          categoryId: '22'
        },
        status: {
          privacyStatus: 'public'
        }
      },
      media: {
        body: fs.createReadStream(req.file.path)
      }
    })

    res.json({
      success: true,
      url: `https://youtube.com/watch?v=${response.data.id}`
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => {
  console.log('Server berjalan di port 5000')
})
