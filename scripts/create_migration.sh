#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "$SCRIPT_DIR/include/common.sh"

migration="$*"
echo_section "Generating up and down db files for '$migration'"
docker_compose run --rm db-migrate -create "$migration"

echo_section 'Removing down files to keep things clean (for now)'
find \
	"$SCRIPT_DIR/../db/migrations" \
	-type f \
	-name '*.down.sql' \
	-delete \
	-print
