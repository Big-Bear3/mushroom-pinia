/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/']
            }
        ]
    },
    externals: {
        pinia: {
            root: 'pinia',
            commonjs2: 'pinia',
            commonjs: 'pinia',
            amd: 'pinia'
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }

    return config;
};
