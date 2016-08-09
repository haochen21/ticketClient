import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ControlMessages } from '../../component/control-messages.component';
import { ValidationService } from '../../../service/validation.service';

import { StoreService } from '../../../service/store.service';
import { Category } from '../../../model/Category';

@Component({
    selector: 'cateogry-create',
    directives: [REACTIVE_FORM_DIRECTIVES, ControlMessages],
    templateUrl: './category-create.component.html',
    styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent { 

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private router: Router) {

    this.form = formBuilder.group({          
      'name': ['', [Validators.minLength(2), Validators.maxLength(20)]],
      'description': ['',[Validators.minLength(4), Validators.maxLength(255)]]
    });
  }

  onSubmit() {
    let category: Category = new Category();
    
    category.name = this.form.value.name;
    category.description = this.form.value.description;

    this.storeService.createCategory(category).then(value => {
      console.log(value);
      this.router.navigate(['/merchant/category']);
    }).catch(error => {
      console.log(error)
    });
  }
}