import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import * as moment from 'moment';

import { NumberFormatPipe } from '../../../pipe/NumberFormat.pipe';

import { SecurityService } from '../../../service/security.service';
import { StoreService } from '../../../service/store.service';
import { OrderService } from '../../../service/order.service';

import { ControlMessages } from '../../component/control-messages.component';

import { Customer } from '../../../model/Customer';
import { Merchant } from '../../../model/Merchant';
import { Category } from '../../../model/Category';
import { Cart } from '../../../model/Cart';
import { CartItem } from '../../../model/CartItem';
import { OpenRange } from '../../../model/OpenRange';
import { Product } from '../../../model/Product';
import { OrderResult } from '../../../model/OrderResult';

@Component({
    selector: 'customer-cartbill',
    providers: [StoreService, OrderService],
    directives: [REACTIVE_FORM_DIRECTIVES, MD_BUTTON_DIRECTIVES, Toasty, SlimLoadingBar],
    pipes: [NumberFormatPipe],
    templateUrl: './cart-bill.component.html',
    styleUrls: ['./cart-bill.component.css']
})
export class CustomerCartBillComponent implements OnInit, OnDestroy {

    customer: Customer;

    carts: Array<Cart>;

    cart: Cart;

    imagePreUrl: string = this.storeService.imagePreUrl;

    cartTakeTime: Array<any> = new Array();

    form: FormGroup;

    orderResult: OrderResult;

    private sub: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private storeService: StoreService,
        private securityService: SecurityService,
        private orderService: OrderService,
        private toastyService: ToastyService,
        private slimLoader: SlimLoadingBarService) {
    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';

        this.slimLoader.start();

        this.securityService.findUser().then(user => {
            this.customer = <Customer>user;
            this.carts = JSON.parse(localStorage.getItem('carts'));
            console.log(this.carts);
            this.form = this.formBuilder.group({
                'takeTimeRange': [, [Validators.required]]
            });
            this.sub = this.route.params.subscribe(params => {
                let merchantId = +params['merchantId']; // (+) converts string 'id' to a number
                for (let cart of this.carts) {
                    if (cart.merchant.id === merchantId) {
                        this.cart = cart;
                        break;
                    }
                }
                console.log(this.cart);
                this.securityService.findOpenRangesByMerchantId(merchantId).then(value => {
                    this.covertTimeToDate(value.openRanges);
                }).catch(error => {
                    console.log(error);
                });
            });
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });


    }

    ngOnDestroy() {
        document.body.style.backgroundColor = '';
        this.sub.unsubscribe();
    }

    getTotalPirce() {
        let total: number = 0;
        for (let item of this.cart.cartItems) {
            if (item.isChecked) {
                total = total + item.totalPrice;
            }
        }
        return total;
    }

    covertTimeToDate(openRanges: Array<OpenRange>) {
        //get max take time
        let takeTimeLimit: number = 0;
        for (let cartItem of this.cart.cartItems) {
            let product: Product = cartItem.product;
            if (product.needPay && product.takeTimeLimit > takeTimeLimit) {
                takeTimeLimit = product.takeTimeLimit;
            }
        }
        let now: moment.Moment = moment(new Date());
        now = now.add(takeTimeLimit, 'minutes');
        console.log(now.toDate());
        for (let openRange of openRanges) {
            let beginDateTime: moment.Moment = moment(new Date());
            let beginTimes: any = openRange.beginTime.toString().split(':');
            beginDateTime = beginDateTime.hours(beginTimes[0]).minutes(beginTimes[1]).seconds(beginTimes[2]).milliseconds(0);

            let endDateTime: moment.Moment = moment(new Date());
            let endTimes: any = openRange.endTime.toString().split(':');
            endDateTime = endDateTime.hours(endTimes[0]).minutes(endTimes[1]).seconds(endTimes[2]).milliseconds(0);

            if (now.isBefore(beginDateTime)) {
                this.cartTakeTime.push({
                    takeBeginTime: beginDateTime.toDate(),
                    takeEndTime: endDateTime.toDate(),
                    desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1]
                });
            }
        }
        this.cartTakeTime.sort(function (a, b) {
            if (a.takeBeginTime > b.takeBeginTime) {
                return 1;
            }
            if (a.takeBeginTime < b.takeBeginTime) {
                return -1;
            }
            return 0;
        });
        console.log(this.cartTakeTime);
    }

    onSubmit() {
        this.slimLoader.start();
        this.orderResult = null;
        this.cart.takeBeginTime = this.form.value.takeTimeRange.takeBeginTime;
        this.cart.takeEndTime = this.form.value.takeTimeRange.takeEndTime;

        this.orderService.purchase(this.cart).then(value => {
            this.orderResult = value;
            console.log(this.orderResult);
            if (this.orderResult.result) {
                this.carts = this.carts.filter(c => c.merchant.id !== this.cart.merchant.id);
                localStorage.setItem('carts', JSON.stringify(this.carts));
                this.router.navigate(['/customer/order']);
            }
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });

    }

    addToast(title: string, msg: string) {
        var toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 3000,
            theme: "material",
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.success(toastOptions);
    }
}

