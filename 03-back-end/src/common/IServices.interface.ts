import AdministratorSecvice from "../components/administrator/service";
import CartService from "../components/cart/service";
import CategoryService from "../components/category/service";
import ManufacturerService from "../components/manufacturer/service";
import ProfileService from "../components/profile/service";
import UserService from "../components/user/service";

export default interface IServices {
    categoryService: CategoryService;
    manufacturerService: ManufacturerService;
    administratorService: AdministratorSecvice;
    profileServices: ProfileService;
    userService: UserService;
    cartService: CartService;
}