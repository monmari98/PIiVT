import { Algorithm } from "jsonwebtoken";

interface TokenKeyOptions {
    private: string;
    public: string;
    duration: number;
}

interface TokenOptions {
    auth: TokenKeyOptions,
    refresh:TokenKeyOptions,
    issuer: string;
    algorithm: Algorithm,
}

export default interface IConfig {
    server: {
        port: number,
        static: {
            path: string,
            route: string,
            index: boolean,
            dotfiles: string,
            maxAge: number,
            etag: boolean,
            cacheControl: boolean,
        },
    },
    database: {
        host: string,
        user: string,
        password: string,
        database: string,
        port: number,
        charset: string,
        timezone: string,
    },
    fileUpload: {
        maxSize: number;
        maxFiles: number;
        temporaryDirectory: string; 
        timeout: number;
        uploadDestinationDirectory: string;
        photos: {
            limits: {
                minWidth: number;
                minHeight: number;
                maxWidth: number;
                maxHeight: number;
            },
            resizes: {
                sufix: string;
                width: number;
                height: number;
                fit: "cover"|"contain";
            }[]
        }
    },
    mail: {
        hostname: string;
        port: number;
        username: string;
        password: string;
        fromEmail: string;
        secure: boolean;
        debug: boolean;
        
    },
    auth: {
        user: TokenOptions,
        administrator: TokenOptions,
        allowRequestsEvenWithoutValidTokens: boolean,
    }
}
