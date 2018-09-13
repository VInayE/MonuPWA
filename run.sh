#!/bin/bash

echo "running server"

echo "Skipping env. specific check. and running for prod."
#if [ "$environment" == "production" ]
#then
npm run prod &
tail -f /dev/null

#else
#echo "please specify correct enivronment variable"
#fi
