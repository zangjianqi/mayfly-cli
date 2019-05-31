const chalk = require('chalk')

const help = {
  init(){
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ mayfly init webpack-react my-project')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ mayfly init username/repo my-project')
    console.log()
  }
}


module.exports = help;
