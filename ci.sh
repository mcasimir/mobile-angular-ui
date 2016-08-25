#! /bin/bash

set -x
set -e

npm i
xvfb-run npm test
