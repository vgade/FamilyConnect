import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authenticate/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateMemberComponent } from './components/member/create-member/create-member.component';
import { CreateFamilyComponent } from './components/family/create-family/create-family.component';
import { FamilyDetailComponent } from './components/family/family-detail/family-detail.component';
import { MemberDetailComponent } from './components/member/member-detail/member-detail.component';
import { SearchComponent } from './components/search/search.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'create-family', component: CreateFamilyComponent},
  { path: 'create-member', component: CreateMemberComponent},
  { path: 'family-detail', component: FamilyDetailComponent},
  { path: 'member-detail', component: MemberDetailComponent},
  { path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
