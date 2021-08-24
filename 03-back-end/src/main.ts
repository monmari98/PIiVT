import * as express from 'express';
import * as cors from 'cors';
import Config from './config/dev';
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import ManufacturerRouter from './components/manufacturer/router';
import CategoryService from './components/category/service';
import ManufacturerService from './components/manufacturer/service';
import AdministratorSecvice from './components/administrator/service';
import AdministratorRouter from './components/administrator/router';
import ProfileService from './components/profile/service';
import ProfileRouter from './components/profile/routes';
import * as fileUpload from 'express-fileupload';
import UserService from './components/user/service';
import UserRouter from './components/user/router';
import AuthRouter from './components/auth/router';
import CartService from './components/cart/service';
import CartRouter from './components/cart/router';

async function main() {
    const application: express.Application = express();

    application.use(cors());
    application.use(express.json());
    // application.use(express.urlencoded({
    //     extended: false
    // })); 
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
        categoryService: new CategoryService(resouces),
        manufacturerService: new ManufacturerService(resouces),
        administratorService: new AdministratorSecvice(resouces), 
        profileServices: new ProfileService(resouces),
        userService: new UserService(resouces),
        cartService: new CartService(resouces),
    }

    application.use(Config.server.static.route, express.static(Config.server.static.path, {
        index: Config.server.static.index,
        cacheControl: Config.server.static.cacheControl,
        maxAge: Config.server.static.maxAge,
        etag: Config.server.static.etag,
        dotfiles: Config.server.static.dotfiles,
    }));

    Router.setupRoutes(application, resouces, [
        new CategoryRouter(),
        new ManufacturerRouter(),
        new AdministratorRouter(),
        new ProfileRouter(),
        new UserRouter(),
        new AuthRouter(),
        new CartRouter(),
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