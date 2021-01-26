const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? '/recording-on-smartphone-browser' : '',
  trailingSlash: true
};