import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router  } from '@angular/router';

import { PROGRESSBAR_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { FileUploader, FILE_UPLOAD_DIRECTIVES }   from 'ng2-file-upload/ng2-file-upload';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import { NumberFormatPipe } from '../../../pipe/NumberFormat.pipe';

import { StoreService } from '../../../service/store.service';
import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';

const URL = 'http://120.25.90.244:8080/ticketServer/security/merchant/image';
//const URL = 'http://127.0.0.1:8080/ticketServer/security/merchant/image';

@Component({
    selector: 'modify-image',
    directives: [PROGRESSBAR_DIRECTIVES, ControlMessages, FILE_UPLOAD_DIRECTIVES],
    pipes: [NumberFormatPipe],
    templateUrl: './modify-image.component.html',
    styleUrls: ['./modify-image.component.css']
})
export class MerchantModifyImageComponent implements OnInit, OnDestroy {

    merchant: Merchant = new Merchant();

    uploader: FileUploader = new FileUploader({ url: URL });

    fileSize: number = 5;

    imageUrl:string;

    stockDescription: string;

    private sub: any;

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
                if (this.merchant.imageSource) {
                    this.imageUrl = URL + '/' + this.merchant.imageSource + '-md?'+new Date().getTime();
                }
            })
            .catch(error => {
                console.log(error)
            });
        this.uploader.onBuildItemForm = (item, form) => {
            form.append("merchantId", this.merchant.id);
        };
        var _parent = this;
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            _parent.goToMy();
        };
    }

    ngOnDestroy() {

    }

    goToMy() {
        this.router.navigate(['/merchant/my']);
    }
}