import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { SignInMethod } from '@app/constants/sign-in-method';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email:string;
  passwordkey:string;

  hide:boolean = true;
  constructor(private authenticateService:AuthenticateService, private router:Router) { }

  ngOnInit(): void {
  }

  signInWithEmail(){
    this.authenticateService.signInWithEmail(this.email, this.passwordkey);
  }
  signInWithGoogle(){
    this.authenticateService.signIn(SignInMethod.GOOGLE);
  }

  signInWithFacebook(){
    this.authenticateService.signIn(SignInMethod.FACEBOOK);
  }

  register(){
    this.router.navigate(["register"]);
  }
}
