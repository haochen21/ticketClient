import { CustomerComponent } from './customer.component';
import { CustomerMyComponent } from './my/my.component';
import { CustomerModifyComponent } from './modifyuser/modifyuser.component';
import { CustomerPortalComponent } from './portal/portal.component';
import { CustomerCartComponent } from './cart/cart.component';
import { CustomerCartBillComponent } from './cart/cart-bill.component';
import { CustomerCategoryComponent } from './category/category.component';
import { CustomerMerchantComponent } from './merchant/merchant.component';
import { CustomerOrderComponent } from './order/order.component';
import { CustomerProductComponent } from './product/product.component';
import { CustomerModifyPhoneComponent } from './modifyPhone/modifyPhone.component';


// async components must be named routes for WebpackAsyncRoute
export const routes = {
  path: 'customer', component: CustomerComponent,
  children: [
    { path: '', component: CustomerPortalComponent },
    { path: 'my', component: CustomerMyComponent },
    { path: 'modifyuser', component: CustomerModifyComponent },  
    { path: 'modifyphone', component: CustomerModifyPhoneComponent },           
    { path: 'portal', component: CustomerPortalComponent },
    { path: 'cart',  component: CustomerCartComponent },
    { path: 'cartbill/:merchantId', component: CustomerCartBillComponent },
    { path: 'merchant', component: CustomerMerchantComponent },
    { path: 'category/:merchantId', component: CustomerCategoryComponent },
    { path: 'order/:needPay', component: CustomerOrderComponent },
    { path: 'product', component: CustomerProductComponent },
  ]
};
