let assert = require('chai').assert
let sinon = require('sinon')
let CommandGenerator = require('../../lib/CommandGenerator')
let ConnectionConfiguration = require('../../lib/ConnectionConfiguration')
var os = require('os');

describe('CommandGenerator.js', () => {
    describe('generateVariables', () => {
        it('should export ssh command with pem authentication', (done) => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '22',
                'path': '~',
                'authentication': {
                    'type': 'pem-authentication',
                    'pem_path': '/home/test/.ssh/id_rsa'
                }
            })

            let commandGenerator = new CommandGenerator(connectionConfiguration)

            sinon.stub(commandGenerator, '_editVariable').returns(null)

            commandGenerator.generateVariables().then((command) => {
                assert.equal('ssh -p 22 -i /home/test/.ssh/id_rsa foo@1.2.3.4 -t \'cd ~;\' \'exec $SHELL;\'', command)
                commandGenerator._editVariable.restore()
                done()
            })
        })

        if (os.platform() !== 'win32') {
            it('should export ssh command with pem authentication and ~ shortcut', (done) => {
                let connectionConfiguration = new ConnectionConfiguration({
                    'uuid': '65e957bd-f495-4199-9835-52b511181357',
                    'name': 'test',
                    'description': 'my test connection',
                    'user': 'foo',
                    'server': '1.2.3.4',
                    'port': '22',
                    'path': '~',
                    'authentication': {
                        'type': 'pem-authentication',
                        'pem_path': '~/.ssh/id_rsa'
                    }
                })

                let commandGenerator = new CommandGenerator(connectionConfiguration)

                sinon.stub(commandGenerator, '_editVariable').returns(null)

                commandGenerator.generateVariables().then((command) => {
                    assert.match(command, /^ssh -p 22 -i [a-zA-Z/._]+\/.ssh\/id_rsa foo@1.2.3.4 -t 'cd ~;' 'exec \$SHELL;'$/)
                    commandGenerator._editVariable.restore()
                    done()
                })
            })
        }

        it('should export ssh command with password authentication', (done) => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '22',
                'path': '~',
                'authentication': {
                    'type': 'password-authentication'
                }
            })
            let commandGenerator = new CommandGenerator(connectionConfiguration)

            sinon.stub(commandGenerator, '_editVariable').returns(null)

            commandGenerator.generateVariables().then((command) => {
                assert.equal('ssh -p 22 foo@1.2.3.4 -t \'cd ~;\' \'exec $SHELL;\'', command)
                commandGenerator._editVariable.restore()
                done()
            })
        })

        it('should export ssh command with no authentication', (done) => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '22',
                'path': '~',
                'authentication': {
                    'type': 'no-authentication'
                }
            })
            let commandGenerator = new CommandGenerator(connectionConfiguration)

            sinon.stub(commandGenerator, '_editVariable').returns(null)

            commandGenerator.generateVariables().then((command) => {
                assert.equal('ssh -p 22 foo@1.2.3.4 -t \'cd ~;\' \'exec $SHELL;\'', command)
                commandGenerator._editVariable.restore()
                done()
            })
        })

        it('should export ssh command with an custom port', (done) => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '2222',
                'path': '~',
                'authentication': {
                    'type': 'password'
                }
            })
            let commandGenerator = new CommandGenerator(connectionConfiguration)

            sinon.stub(commandGenerator, '_editVariable').returns(null)

            commandGenerator.generateVariables().then((command) => {
                assert.equal('ssh -p 2222 foo@1.2.3.4 -t \'cd ~;\' \'exec $SHELL;\'', command)
                commandGenerator._editVariable.restore()
                done()
            })
        })

        it('should export ssh command with an custom path after connection', (done) => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '80',
                'path': '/home/test',
                'authentication': {
                    'type': 'password'
                }
            })
            let commandGenerator = new CommandGenerator(connectionConfiguration)

            sinon.stub(commandGenerator, '_editVariable').returns(null)

            commandGenerator.generateVariables().then((command) => {
                assert.equal('ssh -p 80 foo@1.2.3.4 -t \'cd /home/test;\' \'exec $SHELL;\'', command)
                commandGenerator._editVariable.restore()
                done()
            })
        })
    })
})
