const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/client/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/client"),
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
