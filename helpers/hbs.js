const Handlebars = require('handlebars');

Handlebars.registerHelper("equal", function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

module.exports = {equal};