import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CustomerMenuComponent } from './menu.component';

@Component({
   selector: 'customer-container',
   template: ` 
     <customer-menu></customer-menu>
     <router-outlet></router-outlet>  
   `,
   styleUrls: ['./customer.component.css'],   
   directives: [ROUTER_DIRECTIVES,CustomerMenuComponent]
})
export class CustomerComponent { 

  public constructor(private titleService: Title ) {

    this.setTitle("消费者");

   }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

}