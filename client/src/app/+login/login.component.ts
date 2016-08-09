import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LoginFormComponent } from './login-form.component';

@Component({    
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    directives: [LoginFormComponent, ROUTER_DIRECTIVES]
})
export class LoginComponent implements OnInit, OnDestroy {

    ngOnInit() {
        document.body.style.background = 'url(assets/img/bg-login.jpg) center top no-repeat';
        document.body.style.backgroundSize = '100%';
    }

    ngOnDestroy() {
        document.body.style.background = '';
    }
}