#!/bin/bash
cd /home/kavia/workspace/code-generation/ecoshare-marketplace-8077-8083/main_container_for_ecoshare_marketplace
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

