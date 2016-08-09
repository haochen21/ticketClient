import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';

@Component({
    selector: 'register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class RegisterFormComponent implements OnInit, OnDestroy { 
    
    ngOnInit() {
        document.body.style.background = 'url(assets/img/map.01.png) center center repeat';
    }

    ngOnDestroy() {
        document.body.style.background = '';
  }
}