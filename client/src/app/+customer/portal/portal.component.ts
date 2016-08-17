import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import {MdButton} from '@angular2-material/button/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';

import { SecurityService } from '../../../service/security.service';

import { Customer } from '../../../model/Customer';
import { Merchant } from '../../../model/Merchant';

@Component({
    selector: 'customer-portal',
    directives: [MD_CARD_DIRECTIVES, MdButton, SlimLoadingBar],
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.css']
})
export class CustomerPortalComponent implements OnInit, OnDestroy {

    merchants: Array<Merchant> = new Array<Merchant>();

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.securityService.findMechantsOfCustomer().then(result => {
            this.merchants = result;
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