import { RegisterComponent } from './register.component';
import { RegisterFormComponent } from './register-form.component';
import { MerchantRegisterComponent } from './merchant-register.component';
import { CustomerRegisterComponent } from './customer-register.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = {
  path: 'register', component: RegisterComponent,
  children: [
       {  path: '', component: RegisterFormComponent  },
       {  path: 'merchant', component: MerchantRegisterComponent },
       {  path: 'customer', component: CustomerRegisterComponent }
  ]
};