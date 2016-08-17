import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router }    from '@angular/router';

import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list/list';

import { ControlMessages } from '../../component/control-messages.component';
import { SecurityService } from '../../../service/security.service';

import { Customer } from '../../../model/Customer';
import { Merchant } from '../../../model/Merchant';

@Component({
    selector: 'customer-merchant',
    directives: [REACTIVE_FORM_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, ControlMessages],
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.css']
})
export class CustomerMerchantComponent implements OnInit, OnDestroy {

    choosedMerchants: Array<Merchant> = new Array<Merchant>();

    merchants: Array<Merchant> = new Array<Merchant>();

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private securityService: SecurityService) { }

    ngOnInit() {
       this.form = this.formBuilder.group({
            'name': ['味千拉面', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        });
        this.securityService.findMechantsOfCustomer().then(result => {
            this.choosedMerchants = result;
            console.log(this.choosedMerchants);
        }).catch(error => {
            console.log(error)
        });
    }

    ngOnDestroy() {

    }

    onSubmit() {
        let name = this.form.value.name;
        this.securityService.findMechantByName(name).then(result => {
            this.merchants = result;
            for (let m of this.merchants) {
                m.concern = false;
                for (let cm of this.choosedMerchants) {
                    if (m.id === cm.id) {
                        m.concern = true;
                        break;
                    }
                }
            }
            console.log(this.merchants);
        }).catch(error => {
            console.log(error)
        });
    }

    addConcern(merchant: Merchant) {
        let merchantIds: Array<number> = new Array();
        merchantIds.push(merchant.id);
        for (let cm of this.choosedMerchants) {
            merchantIds.push(cm.id);
        }
        this.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
            this.choosedMerchants = result;
            for (let m of this.merchants) {
                m.concern = false;
                for (let cm of this.choosedMerchants) {
                    if (m.id === cm.id) {
                        m.concern = true;
                        break;
                    }
                }
            }
        }).catch(error => {
            console.log(error)
        });
    }

    back() {
        window.history.back();
    }

}