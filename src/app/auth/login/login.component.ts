import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthServices } from "../auth.services";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class loginComponent implements OnInit,OnDestroy{
    isloading = false;
    private authStatusSub!: Subscription;
    constructor(public authServices:AuthServices){}
    ngOnInit(){
      this.authStatusSub=  this.authServices.getAuthStatusListener().subscribe(
          authStatus=>{
              this.isloading = false;
          }
      )
    }
    onLogin(form:NgForm){
        if(form.invalid){
            return
        }
        this.authServices.login(form.value.email,form.value.password);
    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}