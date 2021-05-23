const app = require('express')(),
server = require('http').Server(app),
ws = require('ws'),
wss = new ws.Server({
  server
}),
cryptr = require('cryptr'),
mongoose = require('mongoose')
welcome = function(a) {
  let b = [
    `Hey ${a}`,
    `Ha te voilà ${a}, tu nous as apportés des pizzas ?`,
    `Un ${a} sauvage est apparu`,
    `Dites bonjour à ${a} !`,
    `Salut ${a} tu nous avait manqué`,
    `Hey ${a} je ne t'ai jamais vu ici`,
    `Hey ${a}, Je te souhaite la bienvenue parmi nous.`,
    `Bienvenue ${a}`,
    `${a} a rejoint le groupe`
  ]
  return b[Math.floor(Math.random()*b.length)]
}

const config = {
  name: null,
  cluster: null,
  password: null,
  username: null
}

mongoose.connect(process.env.URL || `mongodb+srv://${process.env.username || config.username}:${process.env.password || config.password}@${process.env.cluster || config.cluster}.irlef.mongodb.net/${process.env.name || config.name}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', e => {
  if (e) throw e
  console.log('Connected to data base!')
})

app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({
  extended: true
}))

const ModalMessage = mongoose.model('messages', {
  username: String,
  content: String,
  expire: Number,
  color: String,
  CreatedAt: String
})

app.get('/message', (req, res)=> {
  ModalMessage.find({}, (e, d)=> {
    if (e) return new Error(e)=
    if(!d) {
      console.log(d, 0)
      return res.status(203).json({
        number: 0,
        msg: null
      })
    } else return console.log(d, d.length), res.status(203).json({
      number: d.length || 0,
      msg: d
    }),
    d.forEach(a=>{
      if(a.expire < Date.now()) {
        ModalMessage.findOne({ expire: a.expire }).exec((err, doc)=>{
          if(e) return new Error(e)
          if(!doc) return new Error('Missing document!')
          doc.remove()
        })
      }
    })
  })
})

wss.on('connection', function connection(ws) {
  ws.on('message',
    function incoming(message) {
      wss.clients.forEach(function each(client) {
        console.log('received: %s', message)
        let m = JSON.parse(message)
        
        if (m.event === 'new') return client.send(JSON.stringify({
          event: m.event,
          content: welcome(m.username),
          username: 'SYSTEME 🤖',
          color: '#42f6da',
          date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
        }))
        
        if(m.event === 'leave') return client.send(JSON.stringify({
          event: m.event,
          content: m.username + ' a quitté le groupe.',
          username: 'SYSTEME 🤖',
          date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
        }))
        ModalMessage.findOne({ username: m.username}).exec((err, d) =>{
       if(err) return new Error(err)
       var color
       if(!d) {
         color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
       } else color = d.color
       var ch = Date.now() + 18000000
        if (m.event === 'msg') return client.send(JSON.stringify({
          date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds(),
          username: m.username,
          content: m.content,
          event: m.event,
          color: color
        })),
        new ModalMessage({
          username: m.username,
          content: new cryptr(String(ch)).encrypt(m.content),
          color: color,
          expire: ch,
          CreatedAt:  new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
        }).save((e, r)=> {
          if (e) return new Error(e)
          console.log(r)
        })
      })
      })
      
    })
})

server.listen(process.env.port || 3000, (e)=> {
  if (e) throw new Error(e)
  console.info(`Linstening on port ${process.env.port || 3000}`)
})
