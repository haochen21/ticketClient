import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';

import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';


const URL = 'http://120.25.90.244:8080/ticketServer/security/merchant/image';

@Component({
    selector: 'modify-qrCode',
    templateUrl: './modify-qrCode.component.html',
    styleUrls: ['./modify-qrCode.component.css']
})
export class MerchantModifyQrCodeComponent implements OnInit, OnDestroy {

    merchant: Merchant = new Merchant();

    qrCodeUrl: String;

    constructor(
        private securityService: SecurityService,
        private router: Router) {
    }

    ngOnInit() {
        this.securityService
            .findUser()
            .then(user => {
                console.log(user);
                this.merchant = <Merchant>user;
                if (this.merchant.qrCode) {
                    this.qrCodeUrl = URL + '/' + this.merchant.qrCode + '?'+new Date().getTime();
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    ngOnDestroy() {

    }

    createTicket(event) {
        this.securityService
            .modifyQrCode()
            .then(value => {
                console.log(value);
                this.merchant.qrCode = value.qrCode;
                this.qrCodeUrl = URL + '/' + value.qrCode + '?'+new Date().getTime();
            })
            .catch(error => {
                console.log(error)
            });
        event.stopPropagation();
        event.preventDefault();
    }

}