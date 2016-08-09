import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ROUTER_DIRECTIVES }    from '@angular/router';

import { MerchantMenuComponent } from './menu.component';

@Component({
   selector: 'merchant-container',
   template: ` 
     <merchant-menu></merchant-menu>
     <router-outlet></router-outlet>  
   `,
   styleUrls: ['./merchant.component.css'],   
   directives: [ROUTER_DIRECTIVES,MerchantMenuComponent]
})
export class MerchantComponent {

  public constructor(private titleService: Title ) {

    this.setTitle("商家");

   }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

 }