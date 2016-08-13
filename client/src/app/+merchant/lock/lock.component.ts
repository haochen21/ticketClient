import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {SecurityService} from '../../../service/security.service';

@Component({
  selector: 'merchant-lock',
  directives: [REACTIVE_FORM_DIRECTIVES],
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class MerchantLockComponent implements OnInit {

  form: FormGroup;

  unLock: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.securityService.merchantLock(this.form.value.password).then(result => {
      this.unLock = result.unLock;
      if (this.unLock) {
        this.router.navigate(['/merchant']);
      }
    }).catch(error => {
      console.log(error);
    });
  }
}

