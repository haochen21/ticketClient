import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { MdSlideToggle } from '@angular2-material/slide-toggle/slide-toggle';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { StoreService } from '../../../service/store.service';
import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';
import { Category } from '../../../model/Category';
import { Product } from '../../../model/Product';
import { ProductStatus } from '../../../model/ProductStatus';

@Component({
    selector: 'product-list',
    directives: [TAB_DIRECTIVES, Toasty, SlimLoadingBar],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {    

    categorys: Array<Category>;

    products: Array<Product>;

    imagePreUrl: string = this.storeService.imagePreUrl;

    constructor(
        private storeService: StoreService,
        private securityService: SecurityService,
        private router: Router,
        private toastyService: ToastyService,
        private slimLoader: SlimLoadingBarService) { }

    ngOnInit() {
        this.slimLoader.start();

        //document.body.style.overflow = 'hidden';        

        this.storeService.findCategoryByMerchant().then(value => {
            this.categorys = value;
            //add other for product which has not a category
            let other: Category = new Category();
            other.id = -1;
            other.name = '其它';
            this.categorys.push(other);
            console.log(value);
            return this.storeService.findProductByMerchant();
        }).then(value => {
            this.products = value;
            for (let category of this.categorys) {
                let productOfCategory = this.products.filter(p => {
                    if (category.id === -1 && !p.category) {
                        return true;
                    } else if (p.category && p.category.id == category.id) {
                        return true;
                    }
                });
                category.products = productOfCategory;
            }
            console.log(value);
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error)
        });
    }

    changeProductStatus(event: any, p: Product) {
        if (event.checked) {
            p.status = ProductStatus.ONLINE;
        } else {
            p.status = ProductStatus.OFFLINE;
        }
    }

    modify(id: number) {
        this.router.navigate(['/merchant/product/create', id]);
    }

    update(p: Product) {
        this.slimLoader.color = 'red';
        this.slimLoader.start();
        this.storeService.modifyProduct(p).then(value => {
            console.log(value);
            p = value;
            this.addToast(p);
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
        });
        
    }

    addToast(p: Product) {
        var toastOptions: ToastOptions = {
            title: "更新完成",
            msg: p.name + " 更新成功",
            showClose: true,
            timeout: 5000,
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
    
    ngOnDestroy() {
        //document.body.style.overflow = 'auto';
    }

} 