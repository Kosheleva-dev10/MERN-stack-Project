import { UITheme } from '../enums/theme';

// UI Theme
export const defaultTheme = UITheme.Light;

// Const Names
export const ConstantNames = {
    AccessToken: 'access-token',
    UITheme: 'ui-theme'
}

// API Integration
const env = "development";
// const env = process.env.NODE_ENV || "development";
const HOST = "http://localhost";

const config = {
    development: {
        APIServerURL: `${HOST}:3300/apis`,
        AssetsServerURL: `${HOST}:3300`,
        SocketServerURL: `${HOST}:3030`,
    },
    production: {
        APIServerURL: `http://188.166.229.76/apis`,
        AssetsServerURL: `http://188.166.229.76`,
        // SocketServerURL: `http://188.166.229.76:3030`,
        SocketServerURL: `http://188.166.229.76`,
    }
}

console.log("env: ", env);

export const APIServerURL       = config[env].APIServerURL;
export const AssetsServerURL    = config[env].AssetsServerURL;
export const SocketServerURL    = config[env].SocketServerURL;
