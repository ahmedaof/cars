import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthServices } from "../auth.services";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
})
export class signupComponent implements OnInit,OnDestroy{
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
    onsignup(form:NgForm){
        if(form.invalid){
            return
        }
        this.isloading=true;
        this.authServices.createUser(form.value.email,form.value.password)
    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}
