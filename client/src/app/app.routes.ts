import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { RouterConfig } from '@angular/router';

import { NoContent } from './no-content';

import { CategoryComponent } from './+merchant/category/category.component';
import { CategoryListComponent } from './+merchant/category/category-list.component';
import { CategoryCreateComponent } from './+merchant/category/category-create.component';
import { CategoryModifyComponent } from './+merchant/category/category-modify.component';

import { MerchantModifyComponent} from './+merchant/modifyuser/modifyuser.component';
import { MerchantMyComponent} from './+merchant/my/my.component';
import { OpenTimeComponent} from './+merchant/opentime/opentime.component';
import { AccountComponent } from './+merchant/account/account.component';
import { ProductComponent } from './+merchant/product/product.component';
import { ProductCreateComponent } from './+merchant/product/product-create.component';
import { ProductListComponent } from './+merchant/product/product-list.component';
import { HisCartComponent } from './+merchant/hiscart/hiscart.component';
import { MerchantCartComponent } from './+merchant/cart/cart.component';
import { OrderComponent } from './+merchant/order/order.component';
import { MerchantLockComponent } from './+merchant/lock/lock.component';
import { MerchantModifyImageComponent } from './+merchant/modifyimage/modify-image.component';

import { CustomerComponent } from './+customer/customer.component';
import { CustomerMyComponent } from './+customer/my/my.component';
import { CustomerModifyComponent } from './+customer/modifyuser/modifyuser.component';
import { CustomerPortalComponent } from './+customer/portal/portal.component';
import { CustomerCartComponent } from './+customer/cart/cart.component';
import { CustomerCartBillComponent } from './+customer/cart/cart-bill.component';
import { CustomerCategoryComponent } from './+customer/category/category.component';
import { CustomerMerchantComponent } from './+customer/merchant/merchant.component';
import { CustomerOrderComponent } from './+customer/order/order.component';
import { CustomerProductComponent } from './+customer/product/product.component';
import { CustomerModifyPhoneComponent } from './+customer/modifyPhone/modifyPhone.component';

import { DataResolver } from './app.resolver';

//reload need it 
export const routes: RouterConfig = [
  // make sure you match the component type string to the require in asyncRoutes
  {
    path: '', component: 'LoginComponent'
  },
  {
    path: 'login', component: 'LoginComponent'
  },   
  {
    path: 'register', component: 'RegisterComponent',
    canActivate: [WebpackAsyncRoute],
    children: [
      { path: '', component: 'RegisterFormComponent' },
      { path: 'merchant', component: 'MerchantRegisterComponent' },
      { path: 'customer', component: 'CustomerRegisterComponent' }
    ]
  },
  { path: 'modifypassword', component: 'ModifyPasswordComponent' },
  {
    path: 'merchant', component: 'MerchantComponent',
    canActivate: [WebpackAsyncRoute],
    children: [
      { path: '', component: OrderComponent },
      { path: 'my', component: MerchantMyComponent },
      { path: 'modifyuser', component: MerchantModifyComponent },
      { path: 'modifyimage', component: MerchantModifyImageComponent },
      { path: 'lock', component: MerchantLockComponent },
      { path: 'openRange', component: OpenTimeComponent },
      { path: 'account', component: AccountComponent },
      { path: 'cart', component: MerchantCartComponent },
      { path: 'order',  component: OrderComponent },
      { path: 'hiscart', component: HisCartComponent },
      { path: 'category', component: CategoryComponent,
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
  },
  {
    path: 'customer', component: 'CustomerComponent',
    canActivate: [WebpackAsyncRoute],
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
  },
  { path: '**', component: NoContent },
];

// Async load a component using Webpack's require with es6-promise-loader and webpack `require`
// asyncRoutes is needed for our @angularclass/webpack-toolkit that will allow us to resolve
// the component correctly

export const asyncRoutes: AsyncRoutes = {
  // we have to use the alternative syntax for es6-promise-loader to grab the routes  
  'LoginComponent': require('es6-promise-loader!./+login'),
  'RegisterFormComponent': require('es6-promise-loader!./+register'),
  'RegisterComponent': require('es6-promise-loader!./+register'),
  'ModifyPasswordComponent': require('es6-promise-loader!./+modifypassword'),
  'MerchantRegisterComponent': require('es6-promise-loader!./+register'),
  'CustomerRegisterComponent': require('es6-promise-loader!./+register'),
  'MerchantComponent': require('es6-promise-loader!./+merchant'),
  'CustomerComponent': require('es6-promise-loader!./+customer'),
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
 
  // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
