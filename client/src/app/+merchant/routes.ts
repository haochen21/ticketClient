import { MerchantComponent } from './merchant.component';
import { MerchantMyComponent } from './my/my.component';
import { MerchantModifyComponent} from './modifyuser/modifyuser.component';
import { OpenTimeComponent} from './opentime/opentime.component';
import { CategoryComponent } from './category/category.component';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryCreateComponent } from './category/category-create.component';
import { CategoryModifyComponent } from './category/category-modify.component';
import { AccountComponent } from './account/account.component';
import { ProductComponent } from './product/product.component';
import { ProductCreateComponent } from './product/product-create.component';
import { ProductListComponent } from './product/product-list.component';
import { HisCartComponent } from './hiscart/hiscart.component';
import { MerchantCartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { MerchantLockComponent } from './lock/lock.component';
import { MerchantModifyImageComponent } from './modifyimage/modify-image.component';
import { MerchantModifyQrCodeComponent } from './modifyqrcode/modify-qrcode.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = {
  path: 'merchant', component: MerchantComponent,
  children: [
    { path: '', component: OrderComponent },
    { path: 'my', component: MerchantMyComponent },
    { path: 'modifyuser', component: MerchantModifyComponent },
    { path: 'modifyimage', component: MerchantModifyImageComponent },
    { path: 'modifyQrCode', component: MerchantModifyQrCodeComponent },
    { path: 'lock', component: MerchantLockComponent },
    { path: 'openRange',  component: OpenTimeComponent },
    { path: 'account', component: AccountComponent },
    { path: 'cart', component: MerchantCartComponent },
    { path: 'hiscart', component: HisCartComponent },
    { path: 'order',  component: OrderComponent },
    { path: 'category',   component: CategoryComponent,
        children: [
            { path: 'modify/:id', component: CategoryModifyComponent },
            { path: 'create', component: CategoryCreateComponent },
            { path: '', component: CategoryListComponent }
        ]
    },
    { path: 'product',  component: ProductComponent,
        children: [
            { path: 'create/:id', component: ProductCreateComponent },
            { path: '',   component: ProductListComponent }
        ]
    }
  ]
};
