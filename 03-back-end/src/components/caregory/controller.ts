import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import CategoryModel from "./model";
import { IAddCategory, IAddCategoryValidator } from "./dto/IAddCategory";
import { IEditCategory, IEditCategoryValidator } from "./dto/IEditCategory";

class CategoryController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.categoryService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const categoryId: number = +id;

        if (categoryId <= 0) {
            return res.sendStatus(400);
        }

        const data: CategoryModel|null|IErrorResponse = await this.services.categoryService.getById(categoryId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof CategoryModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddCategoryValidator(data)) {            
            return res.status(400).send(IAddCategoryValidator.errors);
        }

        res.send(await this.services.categoryService.add(data as IAddCategory));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const categoryId: number = +id

        if (categoryId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditCategoryValidator(data)) {            
            return res.status(400).send(IEditCategoryValidator.errors);
        }

        const result =  await this.services.categoryService.edit(categoryId, data as IEditCategory);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.categoryService.delete(id));
    }
}

export default CategoryController;