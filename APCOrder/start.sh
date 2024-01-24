#!/bin/bash

export PATH=/home/mkkwak3197/.nvm/versions/node/v17.9.1/bin:$PATH # shell script 환경 변수 설정

cd front
npm i
npm run build
cd ..
cd back
npm i
npm start