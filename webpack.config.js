module.exports = {
  entry: "./src/index.ts",
  externals: ['tabris', 'tabris-decorators'],
  output: {
    libraryTarget: 'commonjs2',
    filename: "index.js",
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },
  optimization: {
    minimize: true
  }
};
