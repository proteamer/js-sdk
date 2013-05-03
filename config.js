var config = {
    "browserstack": {
        "username": process.env.bs_username,
        "password": process.env.bs_password,
        "timeout": 480
    },
    "port": 9000,
    "tunnellink": "localhost",
    "tunnel": "java -jar BrowserStackTunnel.jar " + process.env.bs_token + " localhost,<port>,0"
};

module.exports = config;
