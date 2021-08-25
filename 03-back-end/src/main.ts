import * as express from 'express';
import * as cors from 'cors';
import Config from './config/dev';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import AdministratorSecvice from './components/administrator/service';
import AdministratorRouter from './components/administrator/router';
import * as fileUpload from 'express-fileupload';
import PatientSecvice from './components/patient/service';
import PatientRouter from './components/patient/router';
import MedicalRecordSecvice from './components/medical-record/service';
import MedicalRecordRouter from './components/medical-record/router';
import AuthRouter from './components/auth/router';
import PriceAgeSecvice from './components/price-age/service';
import PriceAgeRouter from './components/price-age/router';
import PriceNameSecvice from './components/price-name/service';
import PriceNameRouter from './components/price-name/router';
import CategorySecvice from './components/caregory/service';
import CategoryRouter from './components/caregory/router';

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
        patientService: new PatientSecvice(resouces),
        medicalRecordService: new MedicalRecordSecvice(resouces),
        priceAgeService: new PriceAgeSecvice(resouces),
        priceNameService: new PriceNameSecvice(resouces),
        categoryService: new CategorySecvice(resouces),
    }

    application.use(Config.server.static.route, express.static(Config.server.static.path, {
        index: Config.server.static.index,
        cacheControl: Config.server.static.cacheControl,
        maxAge: Config.server.static.maxAge,
        etag: Config.server.static.etag,
        dotfiles: Config.server.static.dotfiles,
    }));

    Router.setupRoutes(application, resouces, [
        new AuthRouter(),
        new AdministratorRouter(),
        new PatientRouter(),
        new MedicalRecordRouter(),
        new PriceAgeRouter(),
        new PriceNameRouter(),
        new CategoryRouter(),
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