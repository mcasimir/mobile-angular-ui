#! /bin/bash

set -x
set -e

npm run build
xvfb-run npm test

# Remove chrome temp files
rm -Rf .com.google*
