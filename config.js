module.exports = {
    "db": {
        "test": 'mongodb://localhost/kudos_test',
        "mongodb": process.env.MONGO_URI || 'mongodb://localhost/kudos'
    },
    "logger": {
        "api": "logs/api.log",
        "exception": "logs/exceptions.log"
    },
    'application': {
        'port': process.env.PORT || 3000
    }
};
