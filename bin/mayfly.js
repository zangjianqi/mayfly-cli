#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')


const helpFn = require('../lib/help');
const list = require('../lib/list');
const init = require('../lib/init');
program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init')
    // .alias('i')
    .usage('<template-name> [project-name]')
    .description('generate a new project from a template')
    .option('-c, --clone [mode]', 'use git clone')
    .option('--offline [mode]', 'use cached template')
    .action((...args) => {
      init(...args);
    })

program
    .command('list')
    .description('list available official templates')
    .action((name, cmd) => {
        list();

    })



  program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`mayfly <command> --help`)} for detailed usage of given command.`)
    console.log()
  })

  program.commands.forEach(
    c => {
      c.on('--help', () => {
        const name = c._name;
        if(helpFn[name]){
          helpFn[name]()
        }else {
          console.log()
        }
      }
    )
    }
)


  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
