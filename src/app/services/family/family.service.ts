import { Injectable } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Family } from '@app/models/family.model';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { Member } from '@app/models/member.model';
import { Observable } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(private authenticateSer:AuthenticateService) { }

  fetchFamiles(userId:string):Observable<Family>{
    let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(userId);
    return new Observable( subscriber =>{
      userRef.get().then((querySnapshot)=>{
        let member:Member = new Member()
        member.deserialize(querySnapshot.data());
        member.familyIds.forEach((familyId:string) => {
          let familyRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
          familyRef.get().then((queryData) => {
            let family:Family = new Family();
            family.deserialize(queryData.data());
            subscriber.next(family);
          });
        });
      });
    });
  }
  addNewFamily(family:Family) :Promise<Family>{
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('families').add(JSON.parse(JSON.stringify(family))).then((familyData)=>{
        let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(this.authenticateSer.loggedInUser.uid);
        // Atomically add a new region to the "regions" array field.
        userRef.update({
          familyIds: firebase.firestore.FieldValue.arrayUnion(familyData.id)
        }).then(() => {
          resolve();
        });
      });
    })
  }
}
