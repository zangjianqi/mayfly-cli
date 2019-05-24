const request = require('request')
const chalk = require('chalk')

function list(){
  request({
    url: 'https://raw.githubusercontent.com/zangjianqi/templetes/master/templetes.json',
    headers: {
      'User-Agent': 'mayfly-cli'
    }
  }, (err, res, body) => {
    if (err) logger.fatal(err)
    const requestBody = JSON.parse(body)
    if (Array.isArray(requestBody)) {
      console.log('  Available official templates:')
      console.log()
      requestBody.forEach(repo => {
        console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(repo.name) +
          ' - ' + repo.description)
      })
    } else {
      console.error(requestBody.message)
    }
  })
}

module.exports = list;
