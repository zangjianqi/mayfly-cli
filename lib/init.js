
const path = require('path')
const fs = require('fs');
const existsSync = require('fs').existsSync
const download = require('download-git-repo')
const home = require('user-home')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')
const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
// const official = 'github:zangjianqi/mayfly-templates';
const official = 'github:zangjianqi/templates';

var questions = [
  {
    type: 'input',
    name: 'override',
    message: "This directory already exists, is it overwritten?(y/n)"
  }
];

module.exports = function(...args){

  const arguments = [...args];
  const cmd = arguments.pop();
  const template = arguments[0];
  const project = arguments[1];
  const hasSlash = template.search("/") !== -1 ? false : true;
  let clone = cmd.clone || false;

  const temp = path.join(home, '.mayfly-templates', template.replace(/[\/:]/g, '-'))

  if(!template){
    console.log('====================================');
    console.log(chalk.blue("this command is missing <template-name> parameter."))
    console.log(chalk.blue(`please use "mayfly init --help" to view help information`))
    console.log('====================================');

    return;
  }


  if(!project){
    console.log('====================================');
    console.log(
      chalk.blue("initializing a project requires an installation directory, please specify a directory")
    )
    console.log(
      chalk.blue('please use "mayfly init --help" to view help information')
    )
    console.log('====================================');

    return;
  }


  const rawName = project;
  const isPlace = !rawName || rawName === '.';
  const name = isPlace ? path.relative('../', process.cwd()) : rawName;
  const to = path.resolve(rawName || '.');

  console.log('cmd::', rawName, isPlace, name, to, home, hasSlash);




  if(isPlace || existsSync(to)){
    inquirer.prompt(questions).then(answers => {
      let override = answers.override;
      override = override.toLowerCase();
      if(override === 'y'){

        run (
          template,
          temp,
          hasSlash,
          clone
        )
        .then(() => {
          handleDownloadSuccess(temp, to);
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
      temp,
      hasSlash,
      clone
    )
    .then(() => {
      handleDownloadSuccess(temp, to);
    })
    .catch((err) => {
      handleDownloadFail(err);
    })
  }



}



function handleDownloadSuccess(temp, to){

  let metaPath = path.join(temp, './meta.js');
  let templateDir = path.join(temp, '/template');

  console.log('templateDir:: ', templateDir);

  Metalsmith(templateDir)
  .destination(to)
  .source('./')
  // .use(layouts('handlebars'))
  .build(function(err) {
    if (err) throw err;
    console.log('Build finished!');
  });


  // if(!existsSync(metaPath)){
  //   console.log(
  //     chalk.blue(
  //       'This project template does not meet the official template standard, missing \"meta.js\" files'
  //     )
  //   )
  //   return ;
  // }
  //
  // let questions = require(metaPath);
  //
  // if(questions){
  //   inquirer.prompt(questions).then((answer) => {
  //     console.log('answer:: ', answer);
  //   })
  // }


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
