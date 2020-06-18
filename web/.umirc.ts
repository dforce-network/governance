import { IConfig } from 'umi-types';
const path = require('path');

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  hash: true,
  // routes: [
  //   {
  //     path: '/',
  //     component: '../layouts/index',
  //     routes: [
  //       { path: '/', component: '../pages/index' }
  //     ]
  //   }
  // ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'Governance',
      dll: false,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    'primary-color': '#D5A14D'
  },
  alias: {
    '@utils': path.resolve(__dirname, './src/utils'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@services': path.resolve(__dirname, './src/services'),
    '@components': path.resolve(__dirname, './src/components'),
  },
  proxy: {
    "/votes": {
      "target": "http://173.82.154.181:8000/",
      "changeOrigin": true,
    }
  }
}

export default config;
