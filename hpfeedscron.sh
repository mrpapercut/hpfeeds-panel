#!/bin/bash

if [[ $EUID > 0 ]]; then
  echo "this script must be run as root"
  exit
fi

STATUS=`service dionaea status`

if [[ $(echo $STATUS | grep 'dionaea is not running') ]]; then
  service dionaea restart
fi