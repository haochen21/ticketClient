import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

import * as moment from 'moment';

import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';
import { SocketService } from '../../../service/socket.service';

import { Merchant } from '../../../model/Merchant';
import { OpenRange } from '../../../model/OpenRange';
import { Cart } from '../../../model/Cart';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';
import { CartStatusStat } from '../../../model/CartStatusStat';

import { OrderListComponent } from './order-list.component';

@Component({
    selector: 'merchant-order',
    directives: [ROUTER_DIRECTIVES, TAB_DIRECTIVES, SlimLoadingBar, OrderListComponent],
    providers: [OrderService, SocketService],
    pipes: [DateFormatPipe],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    merchant: Merchant;

    tabs: Array<OpenRange> = [];

    selectedIndex: number;

    connection: any;

    openQueryPanel: boolean = false;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';
        this.refresh();
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
        document.body.style.backgroundColor = '';
    }

    selectTab(tabz: OpenRange) {
        console.log(tabz);
    }

    refresh() {
        this.slimLoader.start();
        this.tabs = [];
        this.securityService.findOpenRanges().then(value => {
            this.covertTimeToDate(value.openRanges);
            this.merchant = value;
            let index = 0;
            for (let openRange of this.merchant.openRanges) {
                openRange.index = index;
                index++;
                this.tabs.push(openRange);
            }
            // 24 hours
            let beginTime: moment.Moment = moment(new Date());
            beginTime.hours(0).minutes(0).seconds(0).milliseconds(0);
            let endTime: moment.Moment = moment(new Date());
            endTime.hours(23).minutes(59).seconds(59).milliseconds(999);
            let range: OpenRange = new OpenRange();
            range.beginTime = beginTime.toDate();
            range.endTime = endTime.toDate();
            range.index = index;
            this.tabs.push(range);

            this.selectedIndex = 0;

            return new Promise(resolve => {
                resolve(this.tabs);
            });
        }).then(value => {
            let excueteArray: Array<any> = new Array();
            for (let openRange of this.tabs) {
                excueteArray.push(this.statStatus(openRange));
                excueteArray.push(this.statProduct(openRange));
            }
            Promise.all(excueteArray).then((results: any[]) => {
                this.connectWebSocket();
                this.slimLoader.complete();
            });

        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    connectWebSocket() {
        this.connection = this.socketService.get(this.merchant).subscribe(value => {
            let cart: Cart = value;
            console.log(cart);

            for (let openRange of this.tabs) {
                if (openRange.beginTime <= cart.takeBeginTime && openRange.endTime >= cart.takeEndTime) {
                    if (cart.status === CartStatus.CONFIRMED) {
                        for (let stat of openRange.statusStat) {
                            if (stat.status === CartStatus.CONFIRMED) {
                                stat.total = stat.total + 1;
                                stat.price = stat.price + cart.totalPrice;
                            }
                        }
                        for (let cartItem of cart.cartItems) {
                            for (let product of openRange.products) {
                                if (product.id === cartItem.product.id) {
                                    product.unTakeNumber = product.unTakeNumber + cartItem.quantity;
                                }
                            }
                        }
                    } else if (cart.status === CartStatus.DELIVERED) {
                        for (let stat of openRange.statusStat) {
                            if (stat.status === CartStatus.DELIVERED) {
                                stat.total = stat.total + 1;
                            }
                            if (stat.status === CartStatus.CONFIRMED) {
                                stat.total = stat.total - 1;
                            }
                        }
                        for (let cartItem of cart.cartItems) {
                            for (let product of openRange.products) {
                                if (product.id === cartItem.product.id) {
                                    product.takeNumber = product.takeNumber + cartItem.quantity;
                                    product.unTakeNumber = product.unTakeNumber - cartItem.quantity;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    statStatus(openRange: OpenRange) {
        let filter: CartFilter = new CartFilter();

        filter.merchantId = this.merchant.id;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        statuses.push(CartStatus.CONFIRMED);
        statuses.push(CartStatus.DELIVERED);
        filter.statuses = statuses;

        filter.takeBeginTime = openRange.beginTime;
        filter.takeEndTime = openRange.endTime;

        return this.orderService.statCartByStatus(filter).then(value => {
            openRange.statusStat = value;
            console.log(value);
            return new Promise(resolve => {
                resolve(value);
            });
        }).catch(error => {
            Promise.reject("error");
        });
    }

    statProduct(openRange: OpenRange) {
        let filter: CartFilter = new CartFilter();

        filter.merchantId = this.merchant.id;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        statuses.push(CartStatus.CONFIRMED);
        statuses.push(CartStatus.DELIVERED);
        filter.statuses = statuses;

        filter.takeBeginTime = openRange.beginTime;
        filter.takeEndTime = openRange.endTime;

        return this.orderService.statCartByProduct(filter).then(value => {
            openRange.products = value;
            console.log(value);
            return new Promise(resolve => {
                resolve(value);
            });
        }).catch(error => {
            Promise.reject("error");
        });
    }

    covertTimeToDate(openRanges: Array<OpenRange>) {
        for (let openRange of openRanges) {
            let beginDate: moment.Moment = moment(openRange.beginTime.toString(), "HH:mm:ss");
            let endDate: moment.Moment = moment(openRange.endTime.toString(), "HH:mm:ss");

            openRange.beginTime = beginDate.toDate();
            openRange.endTime = endDate.toDate();
        }
    }

    openQuery(event) {
        this.openQueryPanel = !this.openQueryPanel;
        event.stopPropagation();
        event.preventDefault();
    }

    selectedOpenRange(event) {
        this.openQueryPanel = false;
        this.selectedIndex = event.value.index;
    }

}