import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { CartService } from '../../service/cart.service';

import { Cart } from '../../model/Cart';

@Component({
    selector: 'customer-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class CustomerMenuComponent implements OnInit {

    isPortal: boolean;
    isCart: boolean;
    isOrder: boolean;
    isMy: boolean;

    totalItem: number = 0;

    subscription: Subscription;

    constructor(
        private cartService: CartService) {
    }

    ngOnInit() {
        this.isPortal = true;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;

        this.getTotalItem(JSON.parse(localStorage.getItem('carts')));

        this.subscription = this.cartService.pucharsingCart$.subscribe(
            carts => {
                console.log('menu cart: ' + carts);
                this.getTotalItem(carts);
            }
        );
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.subscription.unsubscribe();
    }

    menuClick(menuName: string) {
        this.isPortal = false;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;
        if (menuName === 'portal') {
            this.isPortal = true;
        } else if (menuName === 'cart') {
            this.isCart = true;
        } else if (menuName === 'order') {
            this.isOrder = true;
        } else if (menuName === 'my') {
            this.isMy = true;
        }
    }

    getTotalItem(carts: Array<any>) {
        this.totalItem = 0;
        if (carts && carts.length > 0) {
            for (let cart of carts) {
                for (let item of cart.cartItems) {
                    if (item.isChecked) {
                        this.totalItem = this.totalItem + item.quantity;
                    }
                }
            }
        }
    }
}