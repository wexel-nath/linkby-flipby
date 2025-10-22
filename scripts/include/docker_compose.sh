#!/bin/bash
set -e

# shellcheck disable=SC2046
export $(grep -Ev "(^#.*|^$)" '.env' | xargs)

export PROJECT_NAME='linkby-flipby'

docker_compose() {
	docker compose \
		-p "$PROJECT_NAME" \
		-f "$SCRIPT_DIR/../docker-compose.yml" \
		"$@"
}

docker_compose config --quiet
