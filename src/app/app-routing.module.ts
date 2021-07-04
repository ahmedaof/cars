import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { loginComponent } from './auth/login/login.component';
import { signupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path:'',component:PostListComponent},
  {path:'create',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:postId',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'login',component:loginComponent},
  {path:'signup',component:signupComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
