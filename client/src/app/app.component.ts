/*
 * Angular 2 decorators and services
 */
import { Component, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { AppState } from './app.service';

require("font-awesome-webpack");
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [require('!raw!sass!./app.style.scss')],
  template: ` 
     <div class="km-container container"></div>   
     <router-outlet></router-outlet>
   `
})
export class App {

  constructor(
    _router: Router,
    _applicationRef: ApplicationRef,
    public appState: AppState
  ) {
    if (this.isMac()) {
      _router.events.subscribe((value) => {
        _applicationRef.zone.run(() => _applicationRef.tick());
      });
    }
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

  isMac() {
    if (navigator.userAgent.indexOf('Mac') > -1) {
      return true
    }
    return false
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
