#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-dictionary-web-app-221448-221457/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

