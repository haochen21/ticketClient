import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { StoreService } from '../../../service/store.service';

@Component({
    selector: 'product',
    directives: [ROUTER_DIRECTIVES],
    providers:  [StoreService],
    template: `       
      <router-outlet></router-outlet>
    `
})
export class ProductComponent { }