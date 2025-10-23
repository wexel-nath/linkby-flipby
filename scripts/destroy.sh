#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "$SCRIPT_DIR/include/common.sh"

echo_section 'Stopping and removing containers'
docker_compose down

echo_section 'Removing volumes'
docker_compose down -v

echo_section 'Removing images'
docker_compose down --rmi all

echo_section 'Cleaning up orphaned containers'
docker_compose down --remove-orphans

echo_section 'Pruning unused Docker resources'
docker system prune -f

echo_section 'All containers, volumes, and images destroyed successfully'
