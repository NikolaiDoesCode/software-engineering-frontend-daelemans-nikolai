const { i18n } = require('next-i18next');

module.exports = {
    debug: process.env.NODE_ENV === 'development',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    i18n:{
        locales: ['en', 'fr', 'nl'],
        defaultLocale: 'en'
    },
};

exports.i18n = i18n;