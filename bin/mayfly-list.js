#!/usr/bin/env node

const request = require('request')
const chalk = require('chalk')

request({
    url: 'https://api.github.com/users/mayfly-templates/repos',
    headers: {
      'User-Agent': 'mayfly-cli'
    }
  }, (err, res, body) => {
    if (err) return console.log("error::: ", err);
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