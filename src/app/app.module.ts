import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule} from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authenticate/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticateService } from './services/authenticate/authenticate.service';
import { RegisterComponent } from './components/register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FamilyListComponent } from './components/family/family-list/family-list.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { CreateMemberComponent } from './components/member/create-member/create-member.component';
import { SearchFamilyComponent } from './components/family/search-family/search-family.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateFamilyComponent } from './components/family/create-family/create-family.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { SearchMemberComponent } from './components/member/search-member/search-member.component';
import { FamilyDetailComponent } from './components/family/family-detail/family-detail.component';
import { MemberDetailComponent } from './components/member/member-detail/member-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreateFamilyComponent,
    FamilyListComponent,
    CreateMemberComponent,
    SearchFamilyComponent,
    ImageUploaderComponent,
    MemberListComponent,
    SearchMemberComponent,
    FamilyDetailComponent,
    MemberDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatCheckboxModule
  ],
  providers: [
    AuthenticateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
