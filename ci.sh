#! /bin/bash

set -x
set -e

xvfb-run gulp test:ci
