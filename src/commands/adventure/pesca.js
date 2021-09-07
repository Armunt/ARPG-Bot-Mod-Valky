const sql = require('sqlite')
const moment = require('moment')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const items = include('data/items.js')

module.exports.run = async (client, msg, args) => {
  let item_count
  var coins = getRandomIntInclusive(1, 150);
  sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(async row => {
    sql.get('select * from workerInfo where userprofileid = ?', [msg.author.id]).then(async workerInfoRow => {
      if (workerInfoRow == null) {
        utils.sendEmbed(msg, `Comienzas a trabajar, vuelve en 1 hora para reclamar tus ${coins} Oro`)
        var dateWork = moment()
        dateWork.add(1, 'h')
        await sql.run('UPDATE userprofile set gold = ? WHERE userid = ?', [row.gold += coins, msg.author.id])
        await sql.run('INSERT INTO workerInfo (userprofileid, canWork) VALUES (?, ?)', [row.userid, dateWork])
      }
      else {
        let canWork = moment(new Date(workerInfoRow.canWork).toISOString())
        if (moment().isAfter(canWork)) {
          utils.sendEmbed(msg, `Comienzas a trabajar, vuelve en 1 hora para reclamar tus ${coins} Oro`)
          var dateWork = moment()
          dateWork.add(1, 'h')
          await sql.run('UPDATE userprofile set gold = ? WHERE userid = ?', [row.gold += coins, msg.author.id])
          await sql.run('UPDATE workerInfo set canWork = ? where userprofileid = ?', [dateWork.toString(), row.userid])
        }
        else{
          var momentDate = moment(new Date(workerInfoRow.canWork).toISOString())
          utils.sendEmbed(msg, `Ya te encuentras trabajando, vuelve a las ${momentDate.format('hh:mm A')} para ganar mas oro`)
        }
      }
    })
  })
}



module.exports.help = {
  name: 'pesca'
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}