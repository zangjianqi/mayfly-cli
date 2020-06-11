#!/usr/bin/env node


const path = require('path')
const existsSync = require('fs').existsSync
const program = require('commander')
const download = require('download-git-repo')
const home = require('user-home')
const chalk = require('chalk')
const ora = require('ora')
const rm = require("rimraf").sync;
const inquirer = require('inquirer')
const read = require('read-metadata');
const Metalsmith = require('metalsmith');
const minimatch = require("minimatch")
const async = require('async');
const render = require('consolidate').handlebars.render;
const official = 'github:mayfly-templates';


program
  .name("mayfly init")
  .usage('<template-name> [project-name]')
  .option('--local', 'use local cached template')




program.on("--help", () => {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ mayfly init react my-project')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ mayfly init username/repo my-project')
    console.log()
})  



function help(){
    program.parse(process.argv)
    if(program.args.length < 1){
       program.help()
    }
}
help();


  

const args = program.args;
const template = args[0];
const targetDir = args[1];
const local = !!program.local || false;
const hasSlash = template.search("/") !== -1 ? true : false;
const temp = path.join(home, ".mayfly-templates", template.replace(/[\/:#]/g, "-"))
const dest = path.join(process.cwd(), targetDir)

if(!targetDir){
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



if(existsSync(dest)){
  inquirer.prompt([
    {
      type: "confirm",
      name: "overide",
      message: "This directory already exists, is it overwritten"
    }
  ])
  .then(answers => {
    if(answers.overide){
      rm(dest)
    }
    run()
  })
}else {
  run()
}



function run(){

  if(local){
    if(existsSync(temp)){
      generator()
    }else {
      downloadAndGenerate()
    }
  }else {
    downloadAndGenerate()
  }




}

function downloadAndGenerate(){

  if(existsSync(temp)) rm(temp)

  const repo = hasSlash ? template : `${official}/${template}`
  download(repo, temp, {clone: false}, function(err){
    if(err) throw err

    generator()
  })
}



function generator(){

  const meta = getMetaData(temp);
  const prompts = meta['prompts'] ||{};

  const metalsmith = Metalsmith(path.join(temp, '/template'))
  const data = Object.assign(metalsmith.metadata(), {
    dest,
    destDirName: targetDir
  })

  metalsmith
  .use(askQuestions(prompts))
  .use(renderTemplate)
  .use(filterFiles(meta.filters))
  .destination(dest)
  .source('./')
  .build(function(err, file) {
    if (err) throw err;
    if(typeof meta.complete === "function"){
      const helper = {chalk, file}
      meta.complete(data, helper)
    }
    chalk.blue('Build finished!')
  });
}

function askQuestions (prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

function ask(prompts, metadata, done){

  async.eachSeries(Object.keys(prompts), run, done);

  function run(key, done){
    inquirer.prompt([
      {
        key,
        name: key,
        ...prompts[key]
      }
    ]).then((answer) => {
      metadata[key] = answer[key];
      done();
    })
  }
}


function filterFiles(filters){

  return function(files, metalsmith, done){

    const keys = Object.keys(filters);
    const metadata = metalsmith.metadata();

    async.each(keys, run, done);

    function run(file, done){
      let metaName = filters[file]
      let exp = metadata[metaName]

      if(!evalFn(exp, metadata)){
        Object.keys(files).forEach((fileName) => {
          const isMatchFile = minimatch( fileName, file, {dot: true})

          if(isMatchFile){
            delete files[fileName]

          }
        })
      }
      done()
    }
  }

}

function evalFn(exp, data){

  const fn = new Function("data", `with(data){return ${exp}}`)

  try {
    return fn(data)
  } catch (error) {
    console.error("file filter error")
  }
}

function renderTemplate(files, metalsmith, done){
  const keys = Object.keys(files);
  const metadata = metalsmith.metadata();

  async.each(keys, run, done);

  function run(file, done){
    var str = files[file].contents.toString();
    if (!/{{([^{}]+)}}/g.test(str)) {
      return done()
    }
    render(str, metadata, function(err, res){
      if (err) return done(err);
      files[file].contents = new Buffer(res);
      done();
    });
  }
}


function getMetaData(temp){
  let js = path.join(temp, './meta.js');
  let json = path.join(temp, './meta.json');
  let metaData = {};
  if(existsSync(json) ){
    metaData = read.sync(json);
  }else if(existsSync(js)){
    metaData = require(js);
    if(Object(metaData) !== metaData){
      throw "meta.js needs to expose an object'"
    }
  }

  return metaData
}