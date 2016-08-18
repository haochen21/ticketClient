import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm }    from '@angular/forms';

import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import * as moment from 'moment';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';
import { SocketService } from '../../../service/socket.service';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';
import { CartStatusFormatPipe } from '../../../pipe/CartStatus.pipe';

import { Merchant } from '../../../model/Merchant';
import { Cart } from '../../../model/Cart';
import { CartPage } from '../../../model/CartPage';
import { CartItem } from '../../../model/CartItem';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

@Component({
    selector: 'merchant-cart',
    directives: [TAB_DIRECTIVES, SlimLoadingBar],
    providers: [OrderService, SocketService],
    pipes: [DateFormatPipe, CartStatusFormatPipe],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class MerchantCartComponent implements OnInit, OnDestroy {

    merchant: Merchant;

    navbarFormOpen: boolean = false;

    queryOrder: any = {
        no: ''
    };

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 5;

    connection: any;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';
        this.securityService.findUser().then(user => {
            this.merchant = <Merchant>user;
            this.refresh();
            this.connection = this.socketService.get(user).subscribe(value => {
                let cart: Cart = value;
                console.log(cart);
                if (cart.status === CartStatus.CONFIRMED) {
                    this.cartPage.content.unshift(cart);
                } else if (cart.status === CartStatus.DELIVERED) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }

    ngOnDestroy() {
        document.body.style.backgroundColor = '';
        this.connection.unsubscribe();
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

        this.filter.merchantId = this.merchant.id;

        let beginDate: moment.Moment = moment(new Date());
        beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
        let createTimeAfter: Date = beginDate.toDate();
        this.filter.createTimeAfter = createTimeAfter;

        let endDate: moment.Moment = moment(new Date());
        endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
        let createTimeBefore: Date = endDate.toDate();
        this.filter.createTimeBefore = createTimeBefore;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        statuses.push(CartStatus.CONFIRMED);
        this.filter.statuses = statuses;

        this.filter.page = 0;
        this.filter.size = this.size;

        this.queryByFilter();
    }

    navbarFormOpenClick() {
        this.navbarFormOpen = !this.navbarFormOpen;
    }

    onQueryOrder() {
        this.navbarFormOpenClick();
        console.log(this.queryOrder);

        this.filter = new CartFilter();
        this.filter.merchantId = this.merchant.id;

        let beginDate: moment.Moment = moment(new Date());
        beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
        let createTimeAfter: Date = beginDate.toDate();
        this.filter.createTimeAfter = createTimeAfter;

        let endDate: moment.Moment = moment(new Date());
        endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
        let createTimeBefore: Date = endDate.toDate();
        this.filter.createTimeBefore = createTimeBefore;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        statuses.push(CartStatus.CONFIRMED);
        this.filter.statuses = statuses;

        this.filter.no = this.queryOrder.no;

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
}