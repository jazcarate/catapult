module.exports = {
    "db": {
        "test": 'mongodb://localhost/catapult_test',
        "mongodb": process.env.MONGO_URI || 'mongodb://localhost/catapult'
    },
    "logger": {
        "api": "logs/api.log",
        "exception": "logs/exceptions.log"
    },
    'application': {
        'port': process.env.PORT || 3000,
        'gmaps_api': process.env.MAPS_API_KEY || 'UnSecreto!'
    }
};
