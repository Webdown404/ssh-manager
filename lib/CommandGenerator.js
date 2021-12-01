const path = require('path')
const replace = require('replace')
const ConnectionConfiguration = require('./ConnectionConfiguration')
const CCValidator = require('./validator/ConnectionConfigurationValidation')

module.exports = class CommandGenerator {
    constructor (connectionConfiguration) {
        this.cc = connectionConfiguration
    }

    async generateVariables () {
        let command = await this._getCommand()
        this._editVariable('SSH_MANAGER_COMMAND', command)

        return command
    }

    async _getCommand () {
        let command = 'ssh'

        command += ' -p ' + this.cc.port
        if (CCValidator.validateAuthentication(this.cc.authentication)) {
            if (this.cc.authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
                command += ' -i ' + this._resolveHome(this.cc.authentication.pem_path)
            }
        }
        command += ' ' + this.cc.user + '@' + this.cc.server
        command += ' -t "cd ' + this.cc.path + ';"'
        command += ' "exec $SHELL;"'

        return command
    }

    async _editVariable (variableName, variableValue) {
        replace({
            regex: variableName + '=.*',
            replacement: variableName + '="' + variableValue + '"',
            paths: [path.join(__dirname, '/../var/variables')],
            recursive: true,
            silent: true
        })
    }

    _resolveHome (filepath) {
        if (filepath[0] === '~') {
            return path.join(process.env.HOME, filepath.slice(1))
        }
        return filepath
    }
}
