'use strict';

exports.ifArray = function(array, index, options) {
    if(array[index]) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};