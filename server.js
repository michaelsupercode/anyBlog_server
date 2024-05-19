import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { load, save } from './utility/fileHandler.js'
import nodemailer from 'nodemailer';
import './config/config.js'




const app = express();
const PORT = process.env.PORT || 9999
const upload = multer({ dest: './img' })
// const uploadEmail = multer()

app.use(cors({ origin: "*" }))
app.use('/img', express.static('./img'))

app.get("/", (_, res) => res.send("this server works quick and fuckin’ fine :)"));

// nodemailer
const  NODEMAILER_USER = process.env.NODEMAILER_USER
const  NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD



const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",

  port: 2525,

  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

// email route 
app.post('/api/v1/sendEmail', upload.none(), (req, res) => {
  const emailData = req.body
  console.log(emailData)

  if (!emailData) {
    console.log('email Data not found')
    return;
  }

  const email = emailData.email
  const message = emailData.mailContent
  const newMessage = {
    from: `${email}`,
    // to: "sample@sample.com",
    to: "michaelsupercode@gmail.com",

    subject: "New Email",
    text: `New Email from (${email})\n${message}`,
    html: `<h1>New Email from (${email})</h1>\n<p>${message}</p>`
  }

  transport.sendMail(newMessage, (err, info) => {
    if (err) console.log('Error', err)
    else console.log('Info', info)
    res.json({message: 'mail sent'})
  })
})


app.get('/api/v1/getPosts', (req, res) => {
  load()
  .then(data => res.json(data))
  .catch(err => console.log(err))
})

app.get('/api/v1/getPosts/:id', (req, res) => {
  const id = req.params.id
  load()
  .then(data => {
  const singlePost = data.find(post => post.id === id)
  res.json(singlePost) 
})

  .catch(err => console.log(err))
})

app.post('/api/v1/addPost', upload.single('postImage'), (req, res) => {
  const data = req.body
  data.postImage = req.file.path
  console.log(req.file)

  save(data)
  .then(newData => res.json(newData))
  .catch(err => console.log(err))
})

app.listen(PORT, () => console.log('serving at..' + PORT))