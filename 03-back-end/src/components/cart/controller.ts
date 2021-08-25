import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import CartModel from "./model";
import ServiceModel from "../service/model";
// import { IAddCart, IAddCartValidator } from "./dto/IAddCart";
// import { IEditCart, IEditCartValidator } from "./dto/IEditCart";

class CartController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.cartService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const cartId: number = +id;

        if (cartId <= 0) {
            return res.sendStatus(400);
        }

        const data: CartModel|null|IErrorResponse = await this.services.cartService.getById(cartId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof CartModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async getPatientCurrentCart(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.uid);
        const userId: number = id;

        if (userId <= 0) {
            return res.sendStatus(400);
        }

        const data: CartModel|IErrorResponse = await this.services.cartService.getPatientCurrentCart(userId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof CartModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }
    public async setPatientCurrentCart(req: Request, res: Response, next: NextFunction) {
        const userId: number = +(req.params.uid);
        const cartId: number = +(req.params.cid);

        if (userId <= 0) {
            return res.sendStatus(400);
        }
        if (cartId <= 0) {
            return res.sendStatus(400);
        }

        const data: CartModel|IErrorResponse = await this.services.cartService.setPatientCurrentCart(userId, cartId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof CartModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    // public async add(req: Request, res: Response, next: NextFunction) {
    //     const data = req.body;

    //     if (!IAddCartValidator(data)) {            
    //         return res.status(400).send(IAddCartValidator.errors);
    //     }

    //     res.send(await this.Carts.CartCart.add(data as IAddCart));
    // }

    // public async edit(req: Request, res: Response, next: NextFunction) {
    //     const data = req.body;
    //     const id = req.params.id;
    //     const CartId: number = +id

    //     if (CartId <= 0) {
    //         return res.status(400).send("Invalid ID number");
    //     }
    //     if (!IEditCartValidator(data)) {            
    //         return res.status(400).send(IEditCartValidator.errors);
    //     }

    //     const result =  await this.Carts.CartCart.edit(CartId, data as IEditCart);

    //     if (result === null) {            
    //         return res.sendStatus(404);
    //     }

    //     res.send(result);
    // }

    // public async delete(req: Request, res: Response, next: NextFunction) {
    //     const id = +(req.params.id);    

    //     if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

    //     res.send(await this.Carts.CartCart.delete(id));
    // }
}

export default CartController;