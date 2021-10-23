#!/bin/bash
sub_command="$@"
ssh_manager="$(which ssh-manager)"
if [[ -L $ssh_manager ]]
then
    ssh_manager_dir="$(dirname $(dirname $(dirname $ssh_manager)/$(readlink $ssh_manager)))"
else
    # Windows may be used
    ssh_manager_dir="$(dirname $ssh_manager)/node_modules/ssh-manager-cli"
fi

function start_ssh_connection() {
    echo "connecting to ssh server..."
    command=$(getVariable "SSH_MANAGER_COMMAND")
    eval $command
}

function getVariable() {
    cat ${ssh_manager_dir}/var/variables | grep "$1" | cut -d'=' -f2 | sed 's/"//g'
}

function is_ssh_connection_to_start() {
    if [[ $sub_command = 'connect' ]] || [[ -z "$sub_command" ]]
    then
        return 0
    fi

    return 1
}

${ssh_manager_dir}/bin/ssh-manager-handler.js "$@"

if [ $? -ne 0 ]; then
    exit 1
fi

if is_ssh_connection_to_start
then
    start_ssh_connection
fi
