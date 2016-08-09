export { RegisterComponent } from './register.component';
export { RegisterFormComponent } from './register-form.component';
export { MerchantRegisterComponent } from './merchant-register.component';
export { CustomerRegisterComponent } from './customer-register.component';

console.log('`register` bundle loaded asynchronously');
// Must be exported for WebpackAsyncRoute
export * from './routes';
