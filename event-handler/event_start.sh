#!/bin/bash
echo "Pulling lastest!"
sudo git pull

echo "Installing packages!"
npm install

echo "Restart services!"
NODE_ENV=production forever restart src/index.js