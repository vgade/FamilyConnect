import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { SignInMethod } from '@app/constants/sign-in-method';
import { Member } from '@app/models/member.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  googleAuthProvider:any;
  facebookAuthProvider:any;
  loggedInUser:Member;
  isSignedIn:boolean=false;

  constructor(private router:Router) { 
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    this.facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.facebookAuthProvider.addScope('user_birthday');
  }

  signUpWithEmail(member:Member, password:string):Promise<Member>{
    return new Promise((resolve, reject)=>{
      firebase.auth().createUserWithEmailAndPassword(member.email, password).then((credential) => {
        console.log(credential.user);
        member.uid = credential.user.uid;
        this.setUpLoggedInUser(member);
        this.recordLoggedInUser().then(()=>{
          this.isSignedIn = true;
          resolve();
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        reject();
      });
    });
  }

  signInWithEmail(email:string, password:string){
    firebase.auth().signInWithEmailAndPassword(email, password).then((credential) => {
      this.fetchLoggedInUserDetails(credential.user.uid);

    }).catch(function(error) {


    });
  }

  signIn(signInMethod:string){
    switch(signInMethod){
      case SignInMethod.GOOGLE:
        this.signInWithPopup(this.googleAuthProvider);
        break;
      case SignInMethod.FACEBOOK:
        this.signInWithPopup(this.facebookAuthProvider);
    }
  }

  signInWithPopup(provider):Promise<Member>{
    return new Promise((resolve, reject)=>{
      firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential;
        // The signed-in user info.
        this.setUpLoggedInUser(result.user);
        console.log(JSON.stringify(result.user));
        let userRef = firebase.firestore().collection('members').doc(result.user.uid);
        userRef.get().then((querySnapshot) => {
          if(querySnapshot.data()){
            resolve();
          }else{
            this.router.navigate(['register']);
          }
        })
        
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        reject();
      });
    })
  }

  setUpLoggedInUser(user){
    this.loggedInUser = new Member();
    this.loggedInUser.deserialize(this.loggedInUser);
    this.loggedInUser.email = user.email;
    this.loggedInUser.firstName = user.displayName;
    this.loggedInUser.uid = user.uid;

    delete this.loggedInUser.families;
    
    if(user instanceof Member){
      this.loggedInUser.deserialize(user);
    }
  }

  fetchLoggedInUserDetails(uid:string){
    firebase.firestore().collection('members').doc(uid).get().then((snapshot)=> {
      this.loggedInUser = new Member();
      this.loggedInUser.deserialize(snapshot);
    });
  }

  recordLoggedInUser(){
    return firebase.firestore().collection('members').doc(this.loggedInUser.uid).set(JSON.parse(JSON.stringify(this.loggedInUser)));
  }

  resetUser(){
    this.loggedInUser = new Member();
  }

  signOut(){
    firebase.auth().signOut();
  }
}
