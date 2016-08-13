import {Merchant} from './Merchant';
import {Category} from './Category';
import {ProductStatus} from './ProductStatus';

export class Product {

    id: number;
    name: string;    
    unitPrice: number;
    description: string;
    unitsInStock: number;
    unitsInOrder: number;
    infinite: boolean;
    needPay: boolean;
    payTimeLimit: number;
    takeTimeLimit: number;
    imageSource: string;
    createdOn: Date;
    updatedOn: Date;
    status: ProductStatus;
    category: Category;
    merchant: Merchant;
    version: number;    
    
    takeNumber: number;
    unTakeNumber: number;
    
    constructor() { }
}