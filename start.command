#!/bin/bash
# Double-click on a Mac (or run ./start.command). Installs everything on first run, builds the React app and starts the server.
cd "$(dirname "$0")"
pause() { read -p "Press Enter to close"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js 18 or newer is required. Install the LTS version from https://nodejs.org then run this again."; pause; }
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ] || { echo "Node.js is too old. Install the LTS version from https://nodejs.org"; pause; }
[ -d server/node_modules ] || (cd server && npm install --no-audit --no-fund) || { echo "Server install failed. Check your internet connection."; pause; }
[ -d client/node_modules ] || (cd client && npm install --no-audit --no-fund) || { echo "Client install failed. Check your internet connection."; pause; }
(cd client && npm run build) || { echo "Client build failed."; pause; }
PORT=${PORT:-5001}; export PORT
(sleep 4; open "http://127.0.0.1:$PORT") &
cd server && node index.js
