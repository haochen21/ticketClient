import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs/tabs';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';
import { CartStatusFormatPipe } from '../../../pipe/CartStatus.pipe';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';
import { SocketService } from '../../../service/socket.service';

import { Customer } from '../../../model/Customer';
import { Cart } from '../../../model/Cart';
import { CartPage } from '../../../model/CartPage';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

@Component({
    selector: 'customer-order',
    directives: [MD_TABS_DIRECTIVES, MD_BUTTON_DIRECTIVES, SlimLoadingBar],
    providers: [OrderService, SocketService],
    pipes: [DateFormatPipe, CartStatusFormatPipe],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class CustomerOrderComponent implements OnInit, OnDestroy {

    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    connection: any;

    selectedTab: number = 0;

    tabs = [
        { label: '待付款' },
        { label: '待收货' },
        { label: '已完成' }
    ];

    private sub: any;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private route: ActivatedRoute,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let needPay = +params['needPay'];
            if (needPay === 1) {
                this.selectedTab = 0;
            } else {
                this.selectedTab = 1;
            }

            this.slimLoader.start();

            this.securityService.findUser().then(user => {
                this.customer = <Customer>user;
                this.connectWebSocket();

                this.refresh();
                this.slimLoader.complete();
            }).catch(error => {
                console.log(error);
                this.slimLoader.complete();
            });
        });

    }

    ngOnDestroy() {
        this.connection.unsubscribe();
        this.sub.unsubscribe();
    }

    tabChange(event) {
        this.selectedTab = event.index;
        this.refresh();
    }

    getProductNumber(cart: Cart) {
        let number: number = 0;
        for (let i = 0; i < cart.cartItems.length; i++) {
            number += cart.cartItems[i].quantity;
        }
        return number;
    }

    showDetail(cart: Cart) {
        if (cart.showDetail) {
            cart.showDetail = false;
        } else {
            cart.showDetail = true;
        }
    }

    refresh() {
        this.filter = new CartFilter();

        this.filter.customerId = this.customer.id;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        if (this.selectedTab === 0) {
            statuses.push(CartStatus.PURCHASED);
        } else if (this.selectedTab === 1) {
            statuses.push(CartStatus.CONFIRMED);
        } else if (this.selectedTab === 2) {
            statuses.push(CartStatus.DELIVERED);
        }
        this.filter.statuses = statuses;

        this.filter.page = 0;
        this.filter.size = this.size;

        this.queryByFilter();
    }

    queryByFilter() {
        this.slimLoader.start();
        this.orderService.pageCartByFilter(this.filter).then(value => {
            this.cartPage = value;
            console.log(this.cartPage);
            this.filter.page = this.filter.page + 1;
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    queryNextPage() {
        this.queryByFilter();
    }

    connectWebSocket() {
        this.connection = this.socketService.get(this.customer).subscribe(value => {
            let cart: Cart = value;
            console.log(cart);
            if (cart.status === CartStatus.CONFIRMED) {
                if (this.selectedTab === 0) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 1) {
                    this.cartPage.content.unshift(cart);
                }
            } else if (cart.status === CartStatus.DELIVERED) {
                if (this.selectedTab === 0) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 1) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 2) {
                    this.cartPage.content.unshift(cart);
                }
            }
        });
    }

    paying(cart: Cart) {
        this.slimLoader.start();
        this.orderService.paying(cart.id).then(value => {
            console.log(value);
            return this.orderService.paid(cart.id);
        }).then(value => {
            console.log(value);
            this.selectedTab = 1;
            this.refresh();
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    deliver(cart: Cart) {
        this.slimLoader.start();
        this.orderService.deliver(cart.id).then(value => {
            console.log(value);
            this.selectedTab = 2;
            this.refresh();
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

}