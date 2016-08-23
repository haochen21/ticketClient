import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
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
        private _applicationRef: ApplicationRef,
        private securityService: SecurityService,
        private weixinService: WeixinService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.securityService.findMechantsOfCustomer().then(result => {
            this.merchants = result;
            this.weixinService.getJsConfig().then(data => {
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
        let _that = this;
        wx.scanQRCode({
            needResult: 1, 
            scanType: ["qrCode"], 
            success: function (res) {
                if (res.errMsg === "scanQRCode:ok") {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var values = result.split('=');
                    if (values[0] === 'merchant') {
                        let merchantId = +values[1];
                        let isNew: boolean = true;
                        let merchantIds: Array<number> = new Array();
                        for (let merchant of _that.merchants) {
                            merchantIds.push(merchant.id);
                            if (merchantId === merchant.id) {
                                isNew = false;
                                break;
                            }
                        }
                        if (isNew) {
                            merchantIds.push(merchantId);
                            _that.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
                                _that.merchants = result;
                                _that._applicationRef.zone.run(() => _that._applicationRef.tick());
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    }
                }
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