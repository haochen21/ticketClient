import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import * as moment from 'moment';

import { OrderService } from '../../../service/order.service';
import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';
import { Cart } from '../../../model/Cart';
import { CartPage } from '../../../model/CartPage';
import { CartItem } from '../../../model/CartItem';
import { CartStatus } from '../../../model/CartStatus';
import { CartFilter } from '../../../model/CartFilter';

import { DateFormatPipe } from '../../../pipe/DateFormat.pipe';
import { NumberFormatPipe } from '../../../pipe/NumberFormat.pipe';

@Component({
  selector: 'merchant-my',
  pipes: [DateFormatPipe, NumberFormatPipe],
  providers: [OrderService],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.css']
})
export class MerchantMyComponent implements OnInit, OnDestroy {

  merchant: Merchant = new Merchant();

  cartNumber: number = 0;

  earning: number = 0;

  constructor(
    private orderService: OrderService,
    private securityService: SecurityService) { }

  ngOnInit() {
    document.body.style.backgroundColor = '#f5f5f5';

    this.securityService
      .findUser()
      .then(user => {
        console.log(user);
        this.merchant = <Merchant>user;
      })
      .catch(error => {
        console.log(error)
      });

    this.statCartNumber();
    this.statCartEarning();
  }

  ngOnDestroy() {
    document.body.style.backgroundColor = '#fff';
  }

  statCartNumber() {
    let filter: CartFilter = new CartFilter();

    filter.merchantId = this.merchant.id;
    
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

  statCartEarning() {
    let filter: CartFilter = new CartFilter();

    filter.merchantId = this.merchant.id;
    
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

    filter.weixinPaid = true;
    
    filter.needPay = true;

    this.orderService.statCartEarningByStatus(filter).then(value => {
      console.log(value);
      this.earning = value.earning;
      if (!this.earning) {
        this.earning = 0;
      }
    }).catch(error => {
      Promise.reject("error");
    });
  }
}