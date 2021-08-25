import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import CartController from './controller';

export default class CartRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const cartController: CartController = new CartController(resources);

        application.get("/cart", AuthMiddleware.getVerifier("administrator"), cartController.getAll.bind(cartController));
        application.get("/cart/:id", AuthMiddleware.getVerifier("administrator"), cartController.getById.bind(cartController));
        application.post("/user/:uid/cart/", AuthMiddleware.getVerifier("administrator"), cartController.getPatientCurrentCart.bind(cartController));
        application.put("/user/:uid/cart/:cid", AuthMiddleware.getVerifier("administrator"), cartController.setPatientCurrentCart.bind(cartController));
    }
}