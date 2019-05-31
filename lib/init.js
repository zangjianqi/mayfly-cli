
const path = require('path')
const existsSync = require('fs').existsSync
const download = require('download-git-repo')
const home = require('user-home')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')

const official = 'github:zangjianqi/mayfly-templates';

var questions = [
  {
    type: 'input',
    name: 'override',
    message: "This directory already exists, is it overwritten?(y/n)"
  }
];

module.exports = function(...args){

  // console.log('init:: ', args)


  const arguments = [...args];
  const cmd = arguments.pop();
  const template = arguments[0];
  const project = arguments[1];
  let hasSlash = true;
  let clone = false;

  if(cmd.clone && typeof cmd.clone !== 'boolean'){
    clone = cmd.clone
  }

console.log('clone::>> ', clone);

  if(!template){
    console.log('====================================');

    console.log(chalk.blue("this command is missing <template-name> parameter."))
    console.log(chalk.blue(`please use "mayfly init --help" to view help information`))

    console.log('====================================');

    return;
  }

  // if(!project){
  //   console.log('====================================');
  //
  //   console.log(chalk.blue("initializing a project requires an installation directory, please specify a directory"))
  //   console.log(chalk.blue('please use "mayfly init --help" to view help information'))
  //
  //   console.log('====================================');
  //
  //   return;
  // }


  if(template.search("/") !== -1){
    hasSlash = false;
  }


  const rawName = project;
  const isPlace = !rawName || rawName === '.';
  const name = isPlace ? path.relative('../', process.cwd()) : rawName;
  const to = path.resolve(rawName || '.');

  console.log('cmd::', rawName, isPlace, name, to, home);




  if(isPlace || existsSync(to)){
    inquirer.prompt(questions).then(answers => {
      let override = answers.override;
      override = override.toLowerCase();
      if(override === 'y'){
        run (
          template,
          name,
          hasSlash,
          clone
        )
        .then(() => {
          handleDownloadSuccess();
        })
        .catch((err) => {
          handleDownloadFail(err);
        })
      }else {
        console.log(
          chalk.blue("This operation is terminated, please rename the directory and start over.")
        );
      }
    });
  }else {
    run (
      template,
      name,
      hasSlash,
      clone
    )
    .then(() => {
      handleDownloadSuccess();
    })
    .catch((err) => {
      handleDownloadFail(err);
    })
  }



}



function handleDownloadSuccess(){
  console.log(
    chalk("Success")
  );
}

function handleDownloadFail(err){
  console.log(
    err,
    chalk.blue(
      ""
    )
  );
}


function run (template, name, hasSlash, clone) {
  let repo = !hasSlash ? template : `${official}#${template}`;
  return downloadAndGenerate(repo, name, clone);
}


function downloadAndGenerate (template, name, clone) {

  return new Promise(function(resolve, reject){
    download(template, name, { clone: clone }, function (err) {
      if(!err){
        resolve();
      }else {
        reject(err);
      }
    })
  })

}
