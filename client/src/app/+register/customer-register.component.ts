import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../component/control-messages.component';
import { ValidationService } from '../../service/validation.service';

import {Customer} from '../../model/Customer';
import {SecurityService} from '../../service/security.service';

@Component({
  selector: 'customer-register',
  directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css']
})
export class CustomerRegisterComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'loginName': ['hugh-', [Validators.required, Validators.minLength(4), Validators.maxLength(20)], ValidationService.loginNameExists],
      'password': ['1234qwer', [Validators.required, ValidationService.passwordValidator]],
      'passwordConfirm': ['1234qwer', Validators.required],
      'name': ['陈昊', Validators.required],
      'cardNo': ['0012345689-', [Validators.required], ValidationService.cardExists],
      'phone': ['13817475681', [Validators.required, ValidationService.phoneValidator]],
      'email': ['chenhao21@163.com', [Validators.required, ValidationService.emailValidator]],
    }, { validator: ValidationService.matchingPasswords('password', 'passwordConfirm') });
  }

  onSubmit() {
    let customer: Customer = new Customer();
    customer.loginName = this.form.value.loginName;
    customer.password = this.form.value.password;
    customer.name = this.form.value.name;
    customer.phone = this.form.value.phone;
    customer.mail = this.form.value.email;
    customer.cardNo = this.form.value.cardNo;

    this.securityService.registerCustomer(customer).then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/customer']);
    }).catch(error => {
      console.log(error)
    });
  }
}

