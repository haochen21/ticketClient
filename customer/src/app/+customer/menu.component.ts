import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

@Component({
    selector: 'customer-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class CustomerMenuComponent implements OnInit {

    isPortal: boolean;
    isCart: boolean;
    isOrder: boolean;
    isMy: boolean;

    ngOnInit() {
        this.isPortal = true;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;
    }

    menuClick(menuName: string) {
        this.isPortal = false;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;
        if (menuName === 'portal') {
            this.isPortal = true;
        } else if (menuName === 'cart') {
            this.isCart = true;
        } else if (menuName === 'order') {
            this.isOrder = true;
        } else if (menuName === 'my') {
            this.isMy = true;
        }
    }
}