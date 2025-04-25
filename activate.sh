#!/bin/bash
source .env
alias comp='docker compose'
if [ -z "${COMPOSE_PROFILES}" ]; then
    echo "No Docker Compose profile is active"
else
    echo "Active profile(s): ${COMPOSE_PROFILES}"
fi

get_compose_profile() {
    if [ -n "${COMPOSE_PROFILES}" ]; then
        echo "[🐳 ${COMPOSE_PROFILES}]"
    fi
}
PS1='${debian_chroot:+($debian_chroot)}[\033[01;32m]\u@\h[\033[00m]:[\033[01;34m]\w[\033[00m]$(get_compose_profile)$ '
