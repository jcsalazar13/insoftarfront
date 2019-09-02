import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './users/user.component';
import { UserEditComponent } from './users/user-edit.component';
//import { UsersResolver } from './users/users.resolver';
import { UserResolver } from './users/user.resolver';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [
  { path: 'users/:id/edit', component: UserEditComponent, resolve: { userResolved: UserResolver }},
  { path: 'users',  component: UserComponent},
  //,  resolve: { usersResolved: UsersResolver }
  { path: '',  component: UserComponent},
  //,  resolve: { usersResolved: UsersResolver }
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
