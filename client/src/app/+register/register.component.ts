import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

@Component({
    selector: 'register',
    template: `
      <register-form></register-form>
      <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class RegisterComponent {
  
 }