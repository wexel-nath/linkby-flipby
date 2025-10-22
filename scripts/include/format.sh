#!/bin/bash
set -e

GREEN='\033[0;32m'
RESET='\033[0m'

echo_section() {
	echo -e "${GREEN}${*}${RESET}"
}
