import path from 'path';
import fs from 'fs';

const StyleLintPlugin = require('stylelint-webpack-plugin');
require('dotenv').config();

module.exports = {
    mode: 'universal',

    // env: {
    //     backendUrl: process.env.BACKEND_URL
    // },

    server: process.env.HTTPS_KEY && process.env.HTTPS_CERT ? {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_KEY)),
            cert: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_CERT))
        }
    } : {},

    render: {
        http2: {
            push: true,
        }
    },

    /*
     ** Headers of the page
     */
    head: {
        title: 'Table UI',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Test Task'
            }
        ],

        link: [
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&display=swap'
            },
            {
                rel: 'stylesheet',
                href: 'https://cdn.materialdesignicons.com/3.6.95/css/materialdesignicons.min.css'
            },
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#000' },

    /*
     ** Global CSS
     */
    css: [
        '~/assets/styles/vendors.scss',
        '~/assets/styles/main.scss'
    ],

    styleResources: {
        scss: '~/assets/styles/shared/*.scss'
    },

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~plugins/buefy',
    ],

    router: {
        linkActiveClass: '_active-link',
        linkExactActiveClass: '_active-exact',
    },

    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/style-resources'
    ],

    /*
     ** Build configuration
     */
    build: {

        publicPath: '/n/',

        //analyze: true,

        /*
         ** You can extend webpack config here
         */
        // postcss: {
        //     // Add plugin names as key and arguments as value
        //     // Install them before as dependencies with npm or yarn
        //     preset: {
        //         // Change the postcss-preset-env settings
        //         autoprefixer: {
        //             grid: true,
        //         }
        //     }
        // },

        extend(config, ctx) {
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });

                config.plugins.push(
                    new StyleLintPlugin({
                        files: ['**/*.scss', '**/*.vue'],
                        failOnError: false,
                        quiet: false
                    })
                );
            }
        }
    }
};
