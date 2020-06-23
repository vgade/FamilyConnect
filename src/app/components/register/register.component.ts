import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Member } from '@app/models/member.model';
import { Router } from '@angular/router';
import { FirebaseService } from '@app/services/firebase/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide:boolean;
  member:Member;
  keypassword:string;

  constructor(private authenticateService:AuthenticateService, private router:Router, private firebaseSer:FirebaseService) { }

  ngOnInit(): void {
    this.member = new Member();
    this.member = this.member.deserialize(this.member);

    this.firebaseSer.userAuthenticated$.subscribe(() => {
      if(this.authenticateService.isSignedIn){
        this.member = this.authenticateService.loggedInUser;
      }
    });
  }

  signUp(){
    if(this.authenticateService.isSignedIn){
      this.authenticateService.recordLoggedInUser().then(()=>{
        this.router.navigate(["dashboard"]);
      });
    }else{
      this.authenticateService.signUpWithEmail(this.member, this.keypassword);
    }
    
  }

  cancel(){
    this.router.navigate([""]);
  }

}
