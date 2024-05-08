# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# sourcing again
source ~/.bashrc

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.13.0`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.2`


git clone https://github.com/Szczerku/ESP_MQTT.git
cd ESP_MQTT/
npm install
npm start
run on your web browser: localhost:8080
