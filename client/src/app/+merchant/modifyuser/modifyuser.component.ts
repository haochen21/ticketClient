import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import {Merchant} from '../../../model/Merchant';
import {SecurityService} from '../../../service/security.service';

@Component({
  selector: 'merchant-register',
  directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
  templateUrl: './modifyuser.component.html',
  styleUrls: ['./modifyuser.component.css']
})
export class MerchantModifyComponent implements OnInit {

  merchant:Merchant = new Merchant();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'loginName': ['', ,],      
      'name': ['', Validators.required],
      'deviceNo': ['', [Validators.required], ValidationService.deviceExists],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'shortName': ['', ,],
      'address': ['', ,],
      'description': ['',[Validators.minLength(4), Validators.maxLength(255)] ,]
    });
  }

  ngOnInit() {
    this.securityService.findUser().then(user => {
      this.merchant = <Merchant> user;
      console.log(user);
      (<FormControl>this.form.controls['loginName']).updateValue(this.merchant.loginName);
      (<FormControl>this.form.controls['name']).updateValue(this.merchant.name);
      (<FormControl>this.form.controls['deviceNo']).updateValue(this.merchant.deviceNo);
      (<FormControl>this.form.controls['phone']).updateValue(this.merchant.phone);
      (<FormControl>this.form.controls['shortName']).updateValue(this.merchant.shortName);
      (<FormControl>this.form.controls['email']).updateValue(this.merchant.mail);
      (<FormControl>this.form.controls['address']).updateValue(this.merchant.address);
      (<FormControl>this.form.controls['description']).updateValue(this.merchant.description);
    }).catch(error => {
      console.log(error)
    });
  }

  onSubmit() {
    let merchant: Merchant = new Merchant();
    merchant.id = this.merchant.id;
    merchant.version = this.merchant.version;
    
    merchant.loginName = this.form.value.loginName;
    merchant.password = this.form.value.password;
    merchant.name = this.form.value.name;
    merchant.phone = this.form.value.phone;
    merchant.mail = this.form.value.email;
    merchant.deviceNo = this.form.value.deviceNo;
    merchant.shortName = this.form.value.shortName;
    merchant.address = this.form.value.address;
    merchant.description = this.form.value.description;

    this.securityService.modifyMerchant(merchant).then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      window.history.back();
    }).catch(error => {
      console.log(error)
    });
  }
}

