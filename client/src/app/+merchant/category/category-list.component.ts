import { Component, OnInit  } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { Category } from '../../../model/Category';
import { StoreService } from '../../../service/store.service';
import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';

@Component({
    selector: 'cateogry',
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar],
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

    merchant: Merchant;

    categorys: Array<Category> = [];

    hasInit:boolean = false;

    constructor(
        private storeService: StoreService,
        private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.slimLoader.start();
        
        this.storeService.findCategoryByMerchant().then(value => {
            this.categorys = value;
            console.log(value);
            this.slimLoader.complete();
            this.hasInit = true;
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    delete(id: number) {
        this.slimLoader.start();
        this.storeService.deleteCategory(id).then(value => {
            if (value.result) {
                this.categorys = this.categorys.filter(c => c.id !== id);
            }
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    modify(id: number) {
        this.router.navigate(['/merchant/category/modify', id]);
    }
}