import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../component/control-messages.component';
import { ValidationService } from '../../service/validation.service';

import {User} from '../../model/User';
import {SecurityService} from '../../service/security.service';

@Component({
    selector: 'password-modify',
    directives: [REACTIVE_FORM_DIRECTIVES,ControlMessages],
    templateUrl: './modify-password.component.html',
    styleUrls: ['./modify-password.component.css']
})
export class ModifyPasswordComponent {

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private securityService: SecurityService,
        private router: Router) {

        this.form = formBuilder.group({
            'password': ['', [Validators.required, ValidationService.passwordValidator]],
            'passwordConfirm': ['', Validators.required]
        }, { validator: ValidationService.matchingPasswords('password', 'passwordConfirm') });
    }

    onSubmit() {
        this.securityService.modifyPassword(this.form.value.password).then(result => {
            window.history.back();
        }).catch(error => {
            console.log(error)
        });
    }
}