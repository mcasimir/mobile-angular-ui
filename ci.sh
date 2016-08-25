#! /bin/bash

set -x
set -e

xvfb-run npm test
