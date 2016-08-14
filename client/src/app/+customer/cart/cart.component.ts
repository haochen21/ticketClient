import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MdCheckbox } from '@angular2-material/checkbox/checkbox';

import { NumberFormatPipe } from '../../../pipe/NumberFormat.pipe';

import { SecurityService } from '../../../service/security.service';
import { StoreService } from '../../../service/store.service';
import { CartService } from '../../../service/cart.service';

import { Customer } from '../../../model/Customer';
import { Merchant } from '../../../model/Merchant';
import { Category } from '../../../model/Category';
import { Cart } from '../../../model/Cart';
import { CartItem } from '../../../model/CartItem';
import { Product } from '../../../model/Product';
import { ProductStatus } from '../../../model/ProductStatus';

@Component({
    selector: 'customer-cart',
    pipes: [NumberFormatPipe],
    providers: [StoreService],
    directives: [MD_BUTTON_DIRECTIVES, MdCheckbox],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CustomerCartComponent implements OnInit, OnDestroy {   

    carts: Array<Cart>;

    imagePreUrl: string = this.storeService.imagePreUrl;

    constructor(
        private router: Router,
        private storeService: StoreService,
        private cartService: CartService,
        private securityService: SecurityService) {
    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';
        this.carts = JSON.parse(localStorage.getItem('carts'));
    }

    ngOnDestroy() {
        document.body.style.backgroundColor = '';
    }

    changeItemCheck(item: CartItem, event) {
        item.isChecked = event.checked;
        this.saveCarts();
    }

    addQuality(item: CartItem) {
        if (item.quantity < 5) {
            item.quantity++;
            item.totalPrice = item.unitPrice * item.quantity;
            this.saveCarts();
        }
    }

    minusQuality(item: CartItem) {
        if (item.quantity > 1) {
            item.quantity--;
            item.totalPrice = item.unitPrice * item.quantity;
            this.saveCarts();
        }
    }

    removeItem(cart: Cart, item: CartItem) {
        cart.cartItems = cart.cartItems.filter(i => i.product.id !== item.product.id);
        if (cart.cartItems.length == 0) {
            this.carts = this.carts.filter(c => c.merchant.id !== cart.merchant.id);
        }
        this.saveCarts();
    }

    getTotalQuality(cart: Cart) {
        let total: number = 0;
        for (let item of cart.cartItems) {
            if (item.isChecked) {
                total = total + item.quantity;
            }
        }
        return total;
    }

    getTotalPirce(cart: Cart) {
        let total: number = 0;
        for (let item of cart.cartItems) {
            if (item.isChecked) {
                total = total + item.totalPrice;
            }
        }
        return total;
    }

    purchase(cart: Cart) {
        cart.cartItems = cart.cartItems.filter(item => item.isChecked ); 
        this.saveCarts();       
        this.router.navigate(['/customer/cartbill', cart.merchant.id]);
    }

    saveCarts() {
        localStorage.setItem('carts', JSON.stringify(this.carts));
        this.cartService.changeCarts(this.carts);
    }
}

