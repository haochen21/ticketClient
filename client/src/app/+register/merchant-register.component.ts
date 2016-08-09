import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../component/control-messages.component';
import { ValidationService } from '../../service/validation.service';

import {Merchant} from '../../model/Merchant';
import {SecurityService} from '../../service/security.service';

@Component({
  selector: 'merchant-register',
  directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
  templateUrl: './merchant-register.component.html',
  styleUrls: ['./merchant-register.component.css']
})
export class MerchantRegisterComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'loginName': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)], ValidationService.loginNameExists],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'passwordConfirm': ['', Validators.required],
      'name': ['', Validators.required],
      'deviceNo': ['', [Validators.required], ValidationService.deviceExists],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'shortName': ['', ,],
      'address': ['', ,]
    }, { validator: ValidationService.matchingPasswords('password', 'passwordConfirm') });
  }

  onSubmit() {
    let merchant: Merchant = new Merchant();
    merchant.loginName = this.form.value.loginName;
    merchant.password = this.form.value.password;
    merchant.name = this.form.value.name;
    merchant.phone = this.form.value.phone;
    merchant.mail = this.form.value.email;
    merchant.deviceNo = this.form.value.deviceNo;
    merchant.shortName = this.form.value.shortName;
    merchant.address = this.form.value.address;

    this.securityService.registerMerchant(merchant).then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/merchant']);
    }).catch(error => {
      console.log(error)
    });
  }
}

