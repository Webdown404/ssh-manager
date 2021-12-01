const CommandGenerator = require('../CommandGenerator')
const ConnectionConfiguration = require('../../lib/ConnectionConfiguration')
const SubCommand = require('./SubCommand')

module.exports = class ConnectionCommand extends SubCommand {
    static async run() {
        let projectConfiguration = await ConnectionCommand._selectConnectionConfiguration()
        let cc = new ConnectionConfiguration(projectConfiguration)
        let cg = new CommandGenerator(cc)
        let command = await cg.generateVariables()
        process.stdin.destroy()
        require('child_process').execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
    }
}
