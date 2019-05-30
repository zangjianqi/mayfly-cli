
const path = require('path')
const existsSync = require('fs').existsSync
const download = require('download-git-repo')
const home = require('user-home')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')

const official = 'github:zangjianqi/templetes';
module.exports = function(...args){

  // console.log('init:: ', args)


  const arguments = [...args];
  const cmd = arguments.pop();
  const templete = arguments[0];
  const project = arguments[1];
  

  if(!templete){
    console.log('====================================');

    console.log(chalk.blue("the init command lack params <template-name>"))
    console.log(chalk.blue("please use mayfly help init"))
  
    console.log('====================================');

    return;
  }

  const rawName = project
  const isPlace = !rawName || rawName === '.'
  const name = isPlace ? path.relative('../', process.cwd()) : rawName
  const to = path.resolve(rawName || '.')

  console.log('cmd::', rawName, isPlace, name, to, home);


  //
  // console.log(program.args, template, hasSlash, rawName, isPlace, name, to);
  //
  // if(isPlace || existsSync(to)){
  //
  // }else {
  //
  // }



}



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
