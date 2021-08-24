import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import ITokenData from "./dto/ITokenData.interface";
import * as jwt from "jsonwebtoken";
import Config from "../../config/dev";
import { IAdministratorLogin, IAdministratorLoginValidator } from "./dto/IAdministratorLogin";

export default class AuthController extends BaseController {

    public async administratorLogin(req: Request, res: Response, next: NextFunction) {
        if (!IAdministratorLoginValidator(req.body)) {
            return res.status(400).send(IAdministratorLoginValidator.errors);
        }

        const data = req.body as IAdministratorLogin;

        const administrator = await this.services.administratorService.getByUsername(data.username);
        if (administrator === null) return res.sendStatus(404);
        console.log(administrator)

        if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.services.administratorService.setLog("password", data.password, administrator.administratorId);
            return res.status(403).send("Invalid administrator password.");
        }

        const authTokenData: ITokenData = {
            id: administrator.administratorId,
            identity: administrator.username,
            role: "administrator",
        };

        const refreshTokenData: ITokenData = {
            id: administrator.administratorId,
            identity: administrator.username,
            role: "administrator",
        };

        const authToken = jwt.sign(
            authTokenData,
            Config.auth.administrator.auth.private,
            {
                algorithm: Config.auth.administrator.algorithm,
                issuer: Config.auth.administrator.issuer,
                expiresIn: Config.auth.administrator.auth.duration,
            },
        );

        const refreshToken = jwt.sign(
            refreshTokenData,
            Config.auth.administrator.refresh.private,
            {
                algorithm: Config.auth.administrator.algorithm,
                issuer: Config.auth.administrator.issuer,
                expiresIn: Config.auth.administrator.refresh.duration,
            },
        );

        res.send({
            authToken: authToken,
            refreshToken: refreshToken,
        });
    }
}