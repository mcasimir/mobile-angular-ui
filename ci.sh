#! /bin/bash

set -x
set -e

xvfb-run npm test

# Remove chrome temp files
rm -Rf .com.google*
