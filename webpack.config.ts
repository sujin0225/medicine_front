import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  // Entry point 설정
  entry: './src/index.ts',

  // Output 설정
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // 모듈 해석 설정
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
        "buffer": false
      }
  },

  // 로더 설정
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
