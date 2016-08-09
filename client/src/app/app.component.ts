/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router }    from '@angular/router';

import { AppState } from './app.service';

require("font-awesome-webpack");
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'body',
  encapsulation: ViewEncapsulation.None,
  styles: [require('!raw!sass!./app.style.scss')],
  template: ` 
     <div class="km-container container">
        <router-outlet></router-outlet>
     </div>   
   `
})
export class App {

  constructor(
    private router: Router,
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
    console.log(window.location.href);
    let type = this.getParaValue('type');
    console.log(type);
    let verify = this.getParaValue('verify');
    console.log(verify);
    if (type === 'C') {
      if (verify === 'true') {
        this.router.navigate(['/customer/modifyuser']);
      } else {
        this.router.navigate(['/customer']);
      }
    } else if (type === 'M') {
      if (verify === 'true') {
        this.router.navigate(['/merchant/modifyuser']);
      } else {
        this.router.navigate(['/merchant']);
      }
    }
  }

  getParaValue(paraName: string) {
    var results = new RegExp('[\?&]' + paraName + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1];
    } else {
      return null;
    }
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
