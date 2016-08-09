import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

@Component({
    selector: 'merchant-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class MerchantMenuComponent implements OnInit {

    isOrder: boolean;
    isProduct: boolean;
    isCart: boolean;
    isMy: boolean;

    ngOnInit() {
        this.isOrder = true;
        this.isProduct = false;
        this.isCart = false;
        this.isMy = false;
    }

    menuClick(menuName: string) {
        this.isOrder = false;
        this.isProduct = false;
        this.isCart = false;
        this.isMy = false;
        if (menuName === 'order') {
            this.isOrder = true;
        } else if (menuName === 'product') {
            this.isProduct = true;
        } else if (menuName === 'cart') {
            this.isCart = true;
        } else if (menuName === 'my') {
            this.isMy = true;
        }
    }
}