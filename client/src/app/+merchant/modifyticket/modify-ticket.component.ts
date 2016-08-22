import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';

import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';


@Component({
    selector: 'modify-ticket',
    templateUrl: './modify-ticket.component.html',
    styleUrls: ['./modify-ticket.component.css']
})
export class MerchantModifyTicketComponent implements OnInit, OnDestroy {

    merchant: Merchant = new Merchant();

    ticketUrl: String;

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
                if (this.merchant.wxTicket) {
                    this.ticketUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + this.merchant.wxTicket;
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
            .modifyWxTicket()
            .then(value => {
                console.log(value);
                this.ticketUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + value.ticket;
            })
            .catch(error => {
                console.log(error)
            });
        event.stopPropagation();
        event.preventDefault();
    }

    goToMy() {
        this.router.navigate(['/merchant/my']);
    }
}