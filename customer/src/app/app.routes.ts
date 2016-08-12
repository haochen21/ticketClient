import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { RouterConfig } from '@angular/router';

import { NoContent } from './no-content';

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


import { DataResolver } from './app.resolver';

//reload need it 
export const routes: RouterConfig = [
  // make sure you match the component type string to the require in asyncRoutes
  {
    path: '', component: 'CustomerComponent'
  },
  { path: 'modifypassword', component: 'ModifyPasswordComponent' },  
  {
    path: 'customer', component: 'CustomerComponent',
    canActivate: [WebpackAsyncRoute],
    children: [
      { path: '', component: CustomerPortalComponent },
      { path: 'my', component: CustomerMyComponent },
      { path: 'modifyuser', component: CustomerModifyComponent },            
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
  'CustomerComponent': require('es6-promise-loader!./+customer'),
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
 
  // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
