#!/bin/bash
echo "Pulling lastest!"
sudo git pull

echo "Installing packages!"
npm install

echo "Restart services!"
forever restart bin/www