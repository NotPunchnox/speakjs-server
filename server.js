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
    `Un ${a} sauvage vient d'apparaître`,
    `Dites bonjour à ${a} !`,
    `Salut ${a} tu nous avait manqué`,
    `Hey ${a} je ne t'ai jamais vu ici`,
    `Hey ${a}, Je te souhaite la bienvenue parmi nous.`,
    `Bienvenue ${a}`,
    `${a} a rejoint le groupe`,
    `Hey ${a} tu es sur le serveur officiel de speakjs`
  ]
  return b[Math.floor(Math.random()*b.length)]
},
  makeid = function(length) {
  var r = []
  var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for ( var i = 0; i < length; i++ ) { r.push(c.charAt(Math.floor(Math.random() * c.length)))
 }
 return r.join('')
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
  avatar: String,
  CreatedAt: String
})

app.get('/message', (req, res)=> {
  ModalMessage.find({}, (e, d)=> {
    if (e) return new Error(e)
    if (!d) {
      return res.status(203).json({
        users: wss.clients.size,
        number: 0,
        msg: null
      })
    } else return res.status(203).json({
        users: wss.clients.size,
        number: d.length || 0,
        msg: d
      }),
    d.forEach(a=> {
      if (a.expire < Date.now()) {
        ModalMessage.findOne({
          expire: a.expire
        }).exec((err, doc)=> {
          if (e) return new Error(e)
          if (!doc) return new Error('Missing document!')
          doc.remove()
        })
      }
    })
  })
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
      JSON.parse(message)
    } catch {
        return
      }
    let m = JSON.parse(message)
    ModalMessage.findOne({
      username: m.username
    }).exec((err, d) => {
      if (err) return new Error(err)
      if (!d) {
        var color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
            avatar = `https://api.multiavatar.com/${makeid(10)}.svg`
      } else { 
        var color = d.color,
            avatar = d.avatar
        }
      var ch = Date.now() + 1800000
      if (m.event === 'msg') {
        console.log(avatar)
        new ModalMessage({
          username: m.username,
          content: new cryptr(String(ch)).encrypt(new cryptr(String(m.expire)).decrypt(m.content)),
          color: color,
          avatar: avatar || `https://api.multiavatar.com/${m.username}.svg`,
          expire: ch,
          CreatedAt: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
        }).save((e, r)=> {
          if (e) return new Error(e)
        })
      }
      wss.clients.forEach(function each(client) {
        var ch = Date.now() + 1800000 / 2.3 * 5
        ws.on('close', () => {
          return client.send(JSON.stringify({
            expire: ch,
            event: 'leave',
            content: new cryptr(String(ch)).encrypt(m.username + ' a quitté le groupe.'),
            username: 'SYSTEME 🤖',
            color: '#42f6da',
            date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
          }))
        })
        if (m.event === 'new') return client.send(JSON.stringify({
          expire: ch, 
          event: m.event,
          content: new cryptr(String(ch)).encrypt(welcome(m.username)),
          user: m.username,
          avatar: avatar,
          username: 'SYSTEME 🤖',
          color: '#42f6da',
          date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds()
        }))
        if (m.event === 'msg') return client.send(JSON.stringify({
          date: new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds(),
          username: m.username,
          content: new cryptr(String(ch)).encrypt(new cryptr(String(m.expire)).decrypt(m.content)),
          expire: ch,
          event: m.event,
          avatar: avatar,
          color: color
        }))
      })
    })
  })
})

server.listen(process.env.PORT || 3000, (e)=> {
  if (e) throw new Error(e)
  console.info(`Linstening on port ${process.env.port || 3000}`)
})
