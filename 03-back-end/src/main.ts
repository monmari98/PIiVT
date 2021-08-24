import * as express from 'express';
import * as cors from 'cors';
import Config from './config/dev';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import AdministratorSecvice from './components/administrator/service';
import AdministratorRouter from './components/administrator/router';
import * as fileUpload from 'express-fileupload';

async function main() {
    const application: express.Application = express();

    application.use(cors());
    application.use(express.json());
    
    application.use(fileUpload({
        limits: {
            fileSize: Config.fileUpload.maxSize,
            files: Config.fileUpload.maxFiles,
        },
        tempFileDir: Config.fileUpload.temporaryDirectory,
        uploadTimeout: Config.fileUpload.timeout,
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        createParentPath: true,
        abortOnLimit: true,
         
    }))


    const resouces: IApplicationResources = {
        databaseConnection: await mysql2.createConnection({
            host: Config.database.host,
            port: Config.database.port,
            user: Config.database.user,
            password: Config.database.password,
            database: Config.database.database,
            charset: Config.database.charset,
            timezone: Config.database.timezone,
            supportBigNumbers: true,
        }),
    }; 

    resouces.databaseConnection.connect();

    resouces.services = {
        administratorService: new AdministratorSecvice(resouces), 
    }

    application.use(Config.server.static.route, express.static(Config.server.static.path, {
        index: Config.server.static.index,
        cacheControl: Config.server.static.cacheControl,
        maxAge: Config.server.static.maxAge,
        etag: Config.server.static.etag,
        dotfiles: Config.server.static.dotfiles,
    }));

    Router.setupRoutes(application, resouces, [
        new AdministratorRouter(),
    ]);

    application.use((req, res) => {
        res.sendStatus(404);
    });

    application.use((err, req, res, next) => {
        res.status(500).send(err.type);
    });

    application.listen(Config.server.port);
}

main();