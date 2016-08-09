import { Component, OnInit } from '@angular/core';
import { NgForm }    from '@angular/common';
import { Router }    from '@angular/router';
import { SecurityService }  from '../../service/security.service';

import { User } from '../../model/User';

@Component({
    selector: 'login-form',  
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    error: any;

    loginNameError: boolean;

    passwordError: boolean;

    constructor(
        private router: Router,
        private securityService: SecurityService) {

        this.loginNameError = false;
        this.passwordError = false;
    }

    model = {
        loginName: '',
        password: '1234qwer'
    };

    onSubmit() {
        console.log(JSON.stringify(this.model));
        this.securityService
            .login(this.model.loginName, this.model.password)
            .then(loginResult => {
                console.log(loginResult);
                if (loginResult.result === 'AUTHORIZED') {
                    this.loginNameError = false;
                    this.passwordError = false;
                    localStorage.setItem('user', JSON.stringify(loginResult.user));                   
                    if (loginResult.user.type === 'M') {
                        this.router.navigate(['/merchant/my']);
                    }else if (loginResult.user.type === 'C') {
                        this.router.navigate(['/customer']);
                    }
                } else if (loginResult.result === 'LOGINNAMEERROR') {
                    this.loginNameError = true;
                    this.passwordError = false;
                } else if (loginResult.result === 'PASSWORDERROR') {
                    this.loginNameError = false;
                    this.passwordError = true;
                }
            })
            .catch(error => this.error = error);
    }

    ngOnInit() {
        let user: any = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.model.loginName = user.loginName;
        }
    }
}