import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthServices{
    private token!:string;
    private userId!:string;
    private isAuth = false;
    private tokenTimer!:any;
    private authStatusListener = new Subject<boolean>();
 constructor(private http:HttpClient, private router:Router){}
 getToken(){
     return this.token;
 }
 getIsAuth(){
     return this.isAuth;
 }
 getUseId(){
 return this.userId;
 }

 getAuthStatusListener(){
     return this.authStatusListener.asObservable();
 }
 createUser(email:string , password:string){
     const authData: AuthData ={
         email:email,
         password:password
     };
  return this.http.post("http://localhost:3000/api/user/signup",authData).
  subscribe(res =>{
    this.router.navigate(['/']);
  },error=>{
      this.authStatusListener.next(false);
  })
 }

 login(email:string,password:string){
    const authData: AuthData ={
        email:email,
        password:password
    };
 this.http.post<{token:string,expiresIn:number,userId:string}>("http://localhost:3000/api/user/login",authData)
 .subscribe(res=>{
     const token = res.token;
     this.token = token;
   
     if(token){
        const expiresInDuration = res.expiresIn;
        this.settAuthTimer(expiresInDuration);

         this.isAuth =true;
         this.authStatusListener.next(true);
         this.userId = res.userId;
         const now = new Date();
         const expirationDate =new Date(now.getTime()+expiresInDuration*1000);
         this.saveAuthData(token,expirationDate,this.userId)
         this.router.navigate(['/']);
     }
 },err=>{
     this.authStatusListener.next(false);
 });

}
autoAuthUser(){
   const authInformation = this.getAuthData();
   if(!authInformation){
       return;
   }
   let now = new Date();
   const expiresIn = authInformation.expirationDate.getTime() - now.getTime() ;
   if(expiresIn >0){
       this.token = authInformation?.token||"";
       this.isAuth = true;
       this.userId = authInformation.userId||"";
       this.settAuthTimer(expiresIn/1000);
       this.authStatusListener.next(true);
       
   }


}
private settAuthTimer(duration:number){
    this.tokenTimer=setTimeout(()=>{
        this.logout();
    },duration*1000);
}

logout(){
    this.token = null||"";
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null||"";
    this.router.navigate(['/']);

}

private saveAuthData(token:string,expiresIn:Date,userId:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expiresIn.toISOString())
    localStorage.setItem('userId',userId);
}
private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('userId');

}
private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token&&!expirationDate){
        return;
    }
    return{
        token:token,
        expirationDate:new Date(expirationDate||''),
        userId:userId
    }
}
}