import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import {Customer} from '../../../model/Customer';
import {SecurityService} from '../../../service/security.service';

@Component({
  selector: 'customer-register',
  directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
  templateUrl: './modifyuser.component.html',
  styleUrls: ['./modifyuser.component.css']
})
export class CustomerModifyComponent implements OnInit {

  customer:Customer;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'loginName': ['', ,],      
      'name': ['', Validators.required],
      'cardNo': ['', [], ValidationService.cardExists],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]]
    });
  }

  ngOnInit() {
    this.securityService.findUser().then(user => {
      this.customer = <Customer> user;
      console.log(user);
      (<FormControl>this.form.controls['loginName']).updateValue(this.customer.loginName);
      (<FormControl>this.form.controls['name']).updateValue(this.customer.name);
      (<FormControl>this.form.controls['cardNo']).updateValue(this.customer.cardNo);
      (<FormControl>this.form.controls['phone']).updateValue(this.customer.phone);
      (<FormControl>this.form.controls['email']).updateValue(this.customer.mail);
    }).catch(error => {
      console.log(error);
    });
  }

  onSubmit() {
    let customer: Customer = new Customer();
    customer.id = this.customer.id;
    customer.version = this.customer.version;
    
    customer.loginName = this.form.value.loginName;
    customer.password = this.form.value.password;
    customer.name = this.form.value.name;
    customer.phone = this.form.value.phone;
    customer.mail = this.form.value.email;
    customer.cardNo = this.form.value.cardNo;

    this.securityService.modifyCustomer(customer).then(user => {
      localStorage.setItem('user', JSON.stringify(user));      
      this.router.navigate(['/customer']);
    }).catch(error => {
      console.log(error);
    });
  }
}

