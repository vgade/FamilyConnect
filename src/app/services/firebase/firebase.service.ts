import { Injectable } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Member } from '@app/models/member.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseAuthMethod:any;
  fireStoreDb: firebase.firestore.Firestore;
  userAuthenticated$:Observable<Member>;
  _userAuthenticatedSource:Subject<Member>;



  constructor(private authenticateService:AuthenticateService, private router:Router) { 
    this._userAuthenticatedSource = new Subject<Member>();
    this.userAuthenticated$ = this._userAuthenticatedSource.asObservable();
  }

  initializeAuthStateChange(){
    this.fireStoreDb = firebase.firestore();
    if(!this.firebaseAuthMethod){
      this.firebaseAuthMethod = firebase.auth().onAuthStateChanged((dbUser) => {
        if (dbUser) {
          this.authenticateService.isSignedIn = true;
          let userRef = this.fireStoreDb.collection('members').doc(dbUser.uid);
          userRef.get().then((querySnapshot) => {
              if(querySnapshot.data()){
                this.authenticateService.setUpLoggedInUser(new Member().deserialize(querySnapshot.data()));
                this.router.navigate(['dashboard']).then(this.triggerAuthentication.bind(this));
              }else{
                this.authenticateService.setUpLoggedInUser(dbUser);
                this.router.navigate(['register']).then(this.triggerAuthentication.bind(this));
              }
            });
        }
        else{
          this.authenticateService.resetUser();
          this.authenticateService.isSignedIn = false;
          this.router.navigate(['']);
        }
      });
    }
  }

  triggerAuthentication(){
    setTimeout(() => {
      this._userAuthenticatedSource.next();
    }, 100)
    
  }
}
