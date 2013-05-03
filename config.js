var config = {
    "browserstack": {
        "username": process.env.browserstack.username,
        "password": process.env.browserstack.password,
        "timeout": 480
    },
    "port": 9000,
    "tunnellink": "localhost",
    "tunnel": "java -jar BrowserStackTunnel.jar " + process.env.browserstack.token + " localhost,<port>,0"
};

module.exports = config;
