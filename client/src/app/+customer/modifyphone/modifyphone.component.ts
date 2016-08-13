import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import {Customer} from '../../../model/Customer';
import {SecurityService} from '../../../service/security.service';

@Component({
  selector: 'customer-phone',
  directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
  templateUrl: './modifyphone.component.html',
  styleUrls: ['./modifyphone.component.css']
})
export class CustomerModifyPhoneComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'phone': ['', [Validators.required, ValidationService.phoneValidator]]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.securityService.modifyCustomerPhone(this.form.value.phone).then(result => {
      this.router.navigate(['/customer']);
    }).catch(error => {
      console.log(error);
    });
  }
}

