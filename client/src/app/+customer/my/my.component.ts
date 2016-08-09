import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import * as moment from 'moment';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';

import { Customer } from '../../../model/Customer';
import { Cart } from '../../../model/Cart';
import { CartPage } from '../../../model/CartPage';
import { CartItem } from '../../../model/CartItem';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';

@Component({
  selector: 'customer-my',
  pipes: [DateFormatPipe],
  directives: [ROUTER_DIRECTIVES,SlimLoadingBar],
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.css']
})
export class CustomerMyComponent implements OnInit, OnDestroy {

  customer: Customer = new Customer();

  cartNumber: number = 0;

  merchantNumber: number = 0;

  earning: number = 0;

  constructor(
    private orderService: OrderService,
    private securityService: SecurityService,
    private slimLoader: SlimLoadingBarService) { }

  ngOnInit() {
    this.slimLoader.start();

    document.body.style.backgroundColor = '#f5f5f5';

    this.securityService.findUser().then(user => {
      this.customer = <Customer>user;
      this.statCartNumber();
      this.statMerchantNumber();
      this.slimLoader.complete();
    }).catch(error => {
      console.log(error);
      this.slimLoader.complete();
    });
  }

  ngOnDestroy() {
    document.body.style.backgroundColor = '#fff';
  }

  statCartNumber() {
    let filter: CartFilter = new CartFilter();

    filter.customerId = this.customer.id;

    let beginDate: moment.Moment = moment(new Date());
    beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
    let createTimeAfter: Date = beginDate.toDate();
    filter.createTimeAfter = createTimeAfter;

    let endDate: moment.Moment = moment(new Date());
    endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
    let createTimeBefore: Date = endDate.toDate();
    filter.createTimeBefore = createTimeBefore;

    let statuses: Array<CartStatus> = new Array<CartStatus>();
    statuses.push(CartStatus.CONFIRMED);
    statuses.push(CartStatus.DELIVERED);
    filter.statuses = statuses;

    this.orderService.statCartNumberByStatus(filter).then(value => {
      console.log(value);
      this.cartNumber = value.number;
    }).catch(error => {
      Promise.reject("error");
    });
  }

  statMerchantNumber() {
    this.securityService.countMechantsOfCustomer().then(value => {
      console.log(value);
      this.merchantNumber = value;
    }).catch(error => {
      Promise.reject("error");
    });
  }
}