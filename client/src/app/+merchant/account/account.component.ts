import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';

import { MapToIterable } from '../../../pipe/MapToIterable.pipe';
import { NumberFormatPipe } from '../../../pipe/NumberFormat.pipe';

import { Merchant } from '../../../model/Merchant';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

@Component({
    selector: 'merchant-account',
    directives: [REACTIVE_FORM_DIRECTIVES, SlimLoadingBar],
    providers: [OrderService],
    pipes: [MapToIterable, NumberFormatPipe],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    openQueryPanel: boolean = false;

    form: FormGroup;

    beginDate: Date;

    endDate: Date;

    filter: CartFilter;

    earnings: Map<string, number>;


    constructor(
        private formBuilder: FormBuilder,
        private orderService: OrderService,
        private securityService: SecurityService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        let beginDate: moment.Moment = moment(new Date());
        beginDate.date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        let beginDateStr = beginDate.format('YYYY-MM-DD');
        this.beginDate = beginDate.toDate();

        let endDate: moment.Moment = moment(new Date());
        endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
        let endDateStr = endDate.format('YYYY-MM-DD');
        this.endDate = endDate.toDate();

        this.form = this.formBuilder.group({
            'beginDate': [beginDateStr],
            'endDate': [endDateStr]
        });
    }

    openQuery(event) {
        this.openQueryPanel = !this.openQueryPanel;
        event.stopPropagation();
        event.preventDefault();
    }

    changeBeginDate(event) {
        let beginDate: moment.Moment = moment(this.form.value.beginDate, 'YYYY-MM-DD');
        this.beginDate = beginDate.toDate();
    }

    changeEndDate(event) {
        let endDate: moment.Moment = moment(this.form.value.endDate, 'YYYY-MM-DD');
        this.endDate = endDate.toDate();
    }

    onSubmit() {
        this.slimLoader.start();

        this.filter = new CartFilter();

        this.openQueryPanel = false;
        let beginDate: moment.Moment = moment(this.beginDate);
        beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
        let takeBeginTimeAfter: Date = beginDate.toDate();
        this.filter.takeBeginTimeAfter = takeBeginTimeAfter;

        let endDate: moment.Moment = moment(this.endDate);
        endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
        let takeBeginTimeBefore: Date = endDate.toDate();
        this.filter.takeBeginTimeBefore = takeBeginTimeBefore;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        statuses.push(CartStatus.CONFIRMED);
        statuses.push(CartStatus.DELIVERED);
        this.filter.statuses = statuses;

        this.filter.weixinPaid = true;

        this.filter.needPay = true;

        this.queryByFilter();
    }

    queryByFilter() {
        this.orderService.statEarningByCreatedOn(this.filter).then(value => {
            this.earnings = value;
            console.log(this.earnings);
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    getTotalPrice() {
        let totalPrice: number = 0;
        for (var key in this.earnings) {
            if (this.earnings.hasOwnProperty(key)) {
                totalPrice = totalPrice + this.earnings[key];
            }
        }
        return totalPrice;
    }
}    