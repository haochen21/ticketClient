import {User} from './User';
import {OpenRange} from './OpenRange';

export class Merchant extends User {

    deviceNo: string;
    shortName: string;
    address: string;
    description: string;
    open: boolean;
    takeByPhone: boolean;
    takeByPhoneSuffix: boolean;
    openRanges: Array<OpenRange>;
    
    concern:boolean;
    
    constructor() {
        super();
    }
}