import { CartStatus } from './CartStatus';

export class CartFilter {
    
    no: string;    
    merchantId: number;
    customerId: number;
    statuses: Array<CartStatus>;
    needPay: boolean;  
    createTimeBefore: Date; 
    createTimeAfter: Date;
    takeBeginTime: Date;
    takeEndTime: Date;
    productId: number;
    page: number;
    size: number;
    
    constructor() { }
}