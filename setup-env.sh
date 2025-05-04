#!/bin/bash

if [ -f .env ]; then
    while IFS= read -r line; do
        [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
        export "$line"
    done < .env
else
    echo ".env file not found"
    exit 1
fi

echo "Environment variables loaded successfully"