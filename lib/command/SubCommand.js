const inquirer = require('inquirer')
const autocompletePrompt = require('inquirer-autocomplete-prompt')
inquirer.registerPrompt('autocomplete', autocompletePrompt)
const prompt = inquirer.prompt
const Fuse = require('fuse.js')
let colors = require('../../app/colors-custom')
let cm = require('../../app/configuration-manager')
let ConnectionConfiguration = require('../ConnectionConfiguration')

module.exports = class SubCommand {
    static async _selectConnectionConfiguration() {
        let allConnectionConfigurationChoices = cm.getConnectionConfigurationList()

        if (allConnectionConfigurationChoices.length === 0) {
            console.log(colors.error(new Error('no connection configuration found into "' + cm.ccfp + '". Please use "config" command.')))
            process.exit(1)
        }

        let fuseOptions = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['name']
        }

        let fuse = new Fuse(allConnectionConfigurationChoices, fuseOptions)

        async function searchConnection(answers, input) {
            if (input == null) {
                return allConnectionConfigurationChoices
            }

            return fuse.search(input)
        }

        let selectConnectionConfigurationInquirer = {
            type: 'autocomplete',
            message: 'Select an connection',
            name: 'uuid',
            source: await searchConnection
        }

        let result = await prompt(selectConnectionConfigurationInquirer)
        let selectedConnectionConfiguration = null
        try {
            selectedConnectionConfiguration = cm.getConnectionConfiguration(result.uuid)
        } catch (e) {
            process.exit(1)
        }

        return new ConnectionConfiguration(selectedConnectionConfiguration)
    }
}
