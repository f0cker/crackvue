module.exports = {
  productionSourceMap: false,
  lintOnSave: 'warning',
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*'},
    overlay: false,
    //proxy: 'https://crackq.org',
  },
};
