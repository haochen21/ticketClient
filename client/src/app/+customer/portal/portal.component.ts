import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import {MdButton} from '@angular2-material/button/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';

import { SecurityService } from '../../../service/security.service';
import { WeixinService } from '../../../service/weixin.service';

import { Customer } from '../../../model/Customer';
import { Merchant } from '../../../model/Merchant';

import * as wx from 'wx';

const URL = 'http://120.25.90.244:8080/ticketServer/security/merchant/image/';

@Component({
    selector: 'customer-portal',
    directives: [MD_CARD_DIRECTIVES, MdButton, SlimLoadingBar],
    providers: [WeixinService],
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.css']
})
export class CustomerPortalComponent implements OnInit, OnDestroy {

    merchants: Array<Merchant> = new Array<Merchant>();

    imagePreUrl: string = URL;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private weixinService: WeixinService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.securityService.findMechantsOfCustomer().then(result => {
            this.merchants = result;
            this.weixinService.getJsConfig().then(data => {
                alert(location.href.split('#')[0]);
                wx.config(data);   
            }).catch(error => {
                console.log(error);
                this.slimLoader.complete();
            });

        }).catch(error => {
            console.log(error)
        });
    }

    ngOnDestroy() {

    }

    addMerchant(event) {
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/customer/merchant']);
    }

    scanBarCode(event) {
        event.stopPropagation();
        event.preventDefault();
        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert(result);
            }
        });
    }

    goToMerchant(merchant: Merchant) {
        this.router.navigate(['/customer/category', merchant.id]);
    }

    cancelConcern(event, merchant: Merchant) {
        let merchantIds: Array<number> = this.merchants.filter(m => m.id !== merchant.id).map(m => m.id);
        this.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
            this.merchants = result;
        }).catch(error => {
            console.log(error)
        });
        event.stopPropagation();
        event.preventDefault();
    }
}