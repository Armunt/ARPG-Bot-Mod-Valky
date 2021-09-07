const sql = require('sqlite')
const botsettings = include('config.json')
const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(async row => {
    row.health = row.maxhealth
    await sql.run('UPDATE userprofile SET health = ? where userid = ?', [row.health, msg.author.id]);
    utils.sendEmbed(msg, `You feel the strength coming back to you, Now you have ${parseFloat(row.health).toFixed(2)}/${parseFloat(row.maxhealth).toFixed(2)} hp`)
  })
}

module.exports.help = {
  name: 'priest'
}