module.exports = {
  devServer: {
    proxy: {
      "/uploads/images": {
        target: {
          protocol: "http",
          host: "localhost",
          port: 3333
        }
      }
    }
  }
};
