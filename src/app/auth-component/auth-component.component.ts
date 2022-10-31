import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private authservice: AuthService, private route: Router,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  isLoginMode = true;
  isLoading = false; // initially the loading spinner wont load. Only on submitting the form, it loads.
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  /* This will help in switching from login mode to signup mode and vice versa. Initially it is in login mode. */
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  /* this form takes the form data as an argument, i.e. the JSON data. Once the login or signup is done, the 
  form is rest. */
  onSubmit(formdata: NgForm) {
    /* This is an extra security even if the form is disabled in the html code. As html code is visible to the 
    user, this code can be changed so if the form is invalid, still submit option should not work. So this is
    an extra security. */
    if (!formdata.valid) {
      return;
    }
    const email = formdata.value.email; // email entered in the form
    const pass = formdata.value.password;// password entered in the form

    let authobs: Observable<AuthResponseData>;

    /* Once the form is submitted, loading is set to true. */
    this.isLoading = true;

    if (this.isLoginMode) {
      authobs = this.authservice.login(email, pass);
    } else {
      authobs = this.authservice.signUp(email, pass);
    }

    /* The observable coming from the service method, for signup or login will give the response data or the
    error coming in from there. */
    authobs.subscribe(
      res => {
        console.log(res);
        /* Once logged in or signed up it should navigate to recipe page */
        this.route.navigate(['/recipes']);
        /* Once we get the response, the loading is false and the loading spinner stops. */
        this.isLoading = false;
      }, errorMessage => {
        //this.error = "An Error Occurred";
        console.log(errorMessage);
        this.error = errorMessage;
        // Call the error alert function to show the error message on top of the screen
        this.showErrorAlert(errorMessage);
        /* Once we get the response, the loading is false and the loading spinner stops. */
        this.isLoading = false;
      });

    formdata.reset();
  }

  onHandleError() {
    this.error = null;
  }

  showErrorAlert(message: string) {
    /*create a new alert component and pass the component name which need to be created. The method
      will return an alert component factory. Angular need to be informed about this dynamic
      component created in appModule using "Entry Component property" as dynamic components are
      not ustilized through declarations in app Module.*/
    const alertcomponentfactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
      );
    const hostalertView = this.alertHost.viewcontainerRef;

       /*clear all the alert components rendered before */
    hostalertView.clear();

    // create a new component programmatically
    const componentRef = hostalertView.createComponent(alertcomponentfactory);

       // use the instance of the component and perform the event emitting and property binding
    componentRef.instance.message = message;

    // use event emitter as a subject observable
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostalertView.clear();
    });
  }

}
