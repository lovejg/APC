
#! /bin/bash
cd "$(dirname "$0")"

cp nginx.conf ../nginx/conf
cd ../nginx

config_file="$(pwd)/conf/nginx.conf"

sudo service nginx stop
sudo killall nginx
sudo nginx -c "$config_file"


echo "Press Enter to exit..."
read input
