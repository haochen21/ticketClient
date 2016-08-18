import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';
import { CartStatusFormatPipe } from '../../../pipe/CartStatus.pipe';

import { Merchant } from '../../../model/Merchant';
import { Cart } from '../../../model/Cart';
import { CartPage } from '../../../model/CartPage';
import { CartItem } from '../../../model/CartItem';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

@Component({
    selector: 'merchant-hiscart',
    providers: [OrderService],
    directives: [REACTIVE_FORM_DIRECTIVES, TAB_DIRECTIVES, SlimLoadingBar],
    pipes: [DateFormatPipe, CartStatusFormatPipe],
    templateUrl: './hiscart.component.html',
    styleUrls: ['./hiscart.component.css']
})
export class HisCartComponent implements OnInit, OnDestroy {

    merchant: Merchant;

    openQueryPanel: boolean = false;

    form: FormGroup;

    date: Date = new Date();

    filter: CartFilter;

    size: number = 8;

    cartPage: CartPage = new CartPage();

    constructor(
        private formBuilder: FormBuilder,
        private orderService: OrderService,
        private securityService: SecurityService,
        private slimLoader: SlimLoadingBarService) {
    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';
        this.securityService.findUser().then(user => {
            this.merchant = <Merchant>user;
            let queryDate: moment.Moment = moment(this.date);
            let queryDateStr = queryDate.format('YYYY-MM-DD');

            this.filter = new CartFilter();
            this.filter.merchantId = this.merchant.id;

            this.form = this.formBuilder.group({
                'date': [queryDateStr],
                'no': [],
                'confirmed': [false],
                'delivered': [true]
            });

            this.setQueryTimeValue();
            this.onSubmit();
        }).catch(error => {
            console.log(error);
        });

    }
    
    ngOnDestroy() {
        document.body.style.backgroundColor = '';
    }

    openQuery() {
        this.openQueryPanel = !this.openQueryPanel;
    }

    changeQueryDate(event) {
        let queryDate: moment.Moment = moment(this.form.value.date, 'YYYY-MM-DD');
        this.date = queryDate.toDate();
        this.setQueryTimeValue();
    }

    setQueryTimeValue() {
        let beginDate: moment.Moment = moment(this.date);
        beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
        let createTimeAfter: Date = beginDate.toDate();
        this.filter.createTimeAfter = createTimeAfter;

        let endDate: moment.Moment = moment(this.date);
        endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
        let createTimeBefore: Date = endDate.toDate();
        this.filter.createTimeBefore = createTimeBefore;
    }

    onSubmit() {
        this.openQueryPanel = false;
        let statuses: Array<CartStatus> = new Array<CartStatus>();

        this.filter.statuses = statuses;
        if (this.form.value.confirmed) {
            statuses.push(CartStatus.CONFIRMED);
        }
        if (this.form.value.delivered) {
            statuses.push(CartStatus.DELIVERED);
        }

        if (this.form.value.no) {
            this.filter.no = this.form.value.no;
            (<FormControl>this.form.controls['no']).updateValue('');
        } else {
            this.filter.no = null;
        }

        this.filter.page = 0;
        this.filter.size = this.size;

        console.log(this.filter);

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
}
