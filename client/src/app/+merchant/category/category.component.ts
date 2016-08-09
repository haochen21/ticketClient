import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { StoreService } from '../../../service/store.service';

@Component({
    selector: 'cateogry',
    directives: [ROUTER_DIRECTIVES],
    providers:  [StoreService],
    template: `       
      <router-outlet></router-outlet>
    `,
    styles: ['.header { background: #3090e6; color: #fff; height: 40px;line-height: 40px;padding-top: 4px;}']
})
export class CategoryComponent { }