
const path = require('path')
const existsSync = require('fs').existsSync
const download = require('download-git-repo')
const home = require('user-home')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')


const official = 'github:zangjianqi/templetes';
const template = program.args[0]
const hasSlash = template.search('/') != -1
const rawName = program.args[1]
const isPlace = !rawName || rawName === '.'
const name = isPlace ? path.relative('../', process.cwd()) : rawName
const to = path.resolve(rawName || '.')
console.log('====================================');
console.log('args::', program.args);
console.log('home::', home, rawName, name);
console.log('====================================');


console.log(program.args, template, hasSlash, rawName, isPlace, name, to);

if(isPlace || existsSync(to)){

}else {

}


run()
function run () {
  if(!hasSlash){
    downloadAndGenerate(template)
  }else {
    let repo =`${official}#${template}`;
    downloadAndGenerate(repo)
  }
}


function downloadAndGenerate (template) {
  console.log('template: ', template, name);
  download(template, name, { clone: false }, function (err) {
    console.log(err ? 'Error' : 'Success', err)
  })
}
