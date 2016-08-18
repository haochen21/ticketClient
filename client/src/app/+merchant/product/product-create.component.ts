import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs/tabs';
import { PROGRESSBAR_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { FileUploader, FILE_UPLOAD_DIRECTIVES }   from 'ng2-file-upload/ng2-file-upload';
import { MdSlideToggle } from '@angular2-material/slide-toggle/slide-toggle';
import { ToastyService, ToastyConfig, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';
import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import { StoreService } from '../../../service/store.service';
import { SecurityService } from '../../../service/security.service';

import { Merchant } from '../../../model/Merchant';
import { Category } from '../../../model/Category';
import { Product } from '../../../model/Product';
import { ProductStatus } from '../../../model/ProductStatus';


const URL = 'http://120.25.90.244:8080/ticketServer/store/product/image';

@Component({
    selector: 'product-create',
    directives: [PROGRESSBAR_DIRECTIVES, Toasty, SlimLoadingBar, REACTIVE_FORM_DIRECTIVES, ControlMessages, FILE_UPLOAD_DIRECTIVES],
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {

    form: FormGroup;

    status = ['销售', '下架'];

    categorys: Array<Category>;

    product: Product = new Product();

    isCreated: boolean = false;

    uploader: FileUploader = new FileUploader({ url: URL });

    fileSize: number = 5;

    URL: string = this.storeService.imagePreUrl;

    imageUrl: string;

    stockDescription: string;

    private sub: any;

    constructor(
        private formBuilder: FormBuilder,
        private storeService: StoreService,
        private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private toastyService: ToastyService,
        private slimLoader: SlimLoadingBarService) {

        this.form = formBuilder.group({
            'name': ['', [Validators.minLength(2), Validators.maxLength(20)]],
            'unitPrice': ['', [Validators.required, ValidationService.currencyValidator]],
            'description': ['', [Validators.minLength(4), Validators.maxLength(255)]],
            'unitsInStock': ['0', [Validators.required, ValidationService.numberValidator]],
            'payTimeLimit': ['10', [Validators.required, ValidationService.timeValidator]],
            'takeTimeLimit': ['0', [Validators.required, ValidationService.timeValidator]],
            'needPay': [this.product.needPay],
            'infinite': [this.product.infinite],
            'status': ['销售', [Validators.required]],
            'category': [{}]
        });
        this.uploader.onBuildItemForm = (item, form) => {
            form.append("loginName", "xiaomian");
            form.append("productId", this.product.id);
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.product.imageSource = response;
            this.imageUrl = URL + '/' + this.product.imageSource + '-md';
        };
    }

    ngOnInit() {

        this.product = new Product();

        this.sub = this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.storeService.findCategoryByMerchant().then(value => {
                this.categorys = value;
                if (id === -1) {
                    let product: Product = new Product();

                    product.infinite = true;
                    product.needPay = true;
                    product.unitsInOrder = 0;

                    this.isCreated = false;
                    
                    (<FormControl>this.form.controls['needPay']).updateValue(this.product.needPay);
                    (<FormControl>this.form.controls['infinite']).updateValue(this.product.infinite);

                    return new Promise<Product>(resolve => {
                        resolve(product);
                    });
                } else {
                    this.isCreated = true;
                    return this.storeService.findProduct(id);
                }
            }).then(value => {
                this.product = value;
                if (this.product.id) {
                    (<FormControl>this.form.controls['name']).updateValue(this.product.name);
                    (<FormControl>this.form.controls['unitPrice']).updateValue(this.product.unitPrice);
                    this.form.controls['unitPrice'].markAsDirty();
                    (<FormControl>this.form.controls['description']).updateValue(this.product.description ? this.product.description : '');
                    (<FormControl>this.form.controls['unitsInStock']).updateValue(this.product.unitsInStock);
                    (<FormControl>this.form.controls['payTimeLimit']).updateValue(this.product.payTimeLimit);
                    (<FormControl>this.form.controls['takeTimeLimit']).updateValue(this.product.takeTimeLimit);
                    if (this.product.status === ProductStatus.ONLINE) {
                        (<FormControl>this.form.controls['status']).updateValue('销售');
                    } else {
                        (<FormControl>this.form.controls['status']).updateValue('下架');
                    }
                    if (this.product.category) {
                        for (let category of this.categorys) {
                            if (category.id === this.product.category.id) {
                                (<FormControl>this.form.controls['category']).updateValue(category);
                                break;
                            }
                        }
                    }
                    if (this.product.imageSource) {
                        this.imageUrl = URL + '/' + this.product.imageSource + '-md';
                    }
                }
                console.log(value);
            }).catch(error => {
                console.log(error);
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSubmit(event) {
        this.slimLoader.color = 'red';
        this.slimLoader.start();

        this.product.name = this.form.value.name;
        this.product.unitPrice = +this.form.value.unitPrice;
        this.product.description = this.form.value.description;
        this.product.unitsInStock = +this.form.value.unitsInStock;
        this.product.payTimeLimit = +this.form.value.payTimeLimit;
        this.product.takeTimeLimit = +this.form.value.takeTimeLimit;
        if (this.form.value.status === '销售') {
            this.product.status = ProductStatus.ONLINE;
        } else if (this.form.value.status === '下架') {
            this.product.status = ProductStatus.OFFLINE;
        }
        if (!this.form.value.category.id) {
            this.product.category = null;
        } else {
            this.product.category = this.form.value.category;
        }

        if (!this.product.id) {
            this.storeService.createProduct(this.product).then(value => {
                this.product = value;
                this.getStockDescription();
                this.isCreated = true;
                this.addToast("创建成功", this.product.name + " 创建成功");
                this.slimLoader.complete();
            }).catch(error => {
                console.log(error);
            });
        } else {
            this.storeService.modifyProduct(this.product).then(value => {
                console.log(value);
                this.product = value;
                this.getStockDescription();
                this.addToast("更新成功", this.product.name + " 更新成功");
                this.slimLoader.complete();
            }).catch(error => {
                console.log(error);
            });
        }
        event.stopPropagation();
        event.preventDefault();
    }

    getStockDescription() {
        this.stockDescription = '';
        if (this.product.infinite) {
            this.stockDescription = '无限库存';
        } else {
            if (this.product.unitsInStock === 0) {
                this.stockDescription = '商品库存为0';
            } else if (this.product.unitsInStock > 50) {
                this.stockDescription = '商品库存' + this.product.unitsInStock;
            } else {
                this.stockDescription = '商品库存有限，请尽快下单';
            }
        }
    }

    addToast(title: string, msg: string) {
        var toastOptions: ToastOptions = {
            title: title,
            msg: msg,
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
}