import { Injectable } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Family } from '@app/models/family.model';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Member } from '@app/models/member.model';
import { Observable } from 'rxjs';
import { ImageService } from '@services/image/image.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  familyDetail:Family;

  constructor(private authenticateSer:AuthenticateService, private imageService:ImageService) { }

  fetchFamiles(memberId:string):Observable<Family>{
    let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
    return new Observable( subscriber =>{
      userRef.get().then((querySnapshot)=>{
        let member:Member = new Member()
        member.deserialize(querySnapshot.data());
        if(member.familyIds && member.familyIds.length > 0){
          member.familyIds.forEach((familyId:string) => {
            let familyRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
            familyRef.get().then((queryData) => {
              let family:Family = new Family();
              family.deserialize(queryData.data());
              family.uid = queryData.id;
              subscriber.next(family);
              this.fetchImage(family);
            });
          });
        }
      });
    });
  }

  fetchImage(family:Family){
    if(family.pic.indexOf('default') !== -1){
      family.picUrl = family.pic;
    }else{
      this.imageService.getDownloadURL(family.pic).then((url) => {
        family.picUrl = url;
      })
    }
  }
  
  createNewFamily(family:Family, loggedInUserFamily:boolean = false) :Promise<Family>{
    delete  family.picUrl;
    delete family.members;
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('families').add(JSON.parse(JSON.stringify(family))).then((familyData)=>{
          resolve();
      });
    })
  }

  addNewFamilies(memberId:string, families:string[]): Promise<Member> {
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
      userRef.update({
        familyIds: firebase.firestore.FieldValue.arrayUnion(...families)
      }).then(() => {
        families.forEach((familyId:string) => {
          this.addMembersToFamily(familyId, [memberId]);
        })
        resolve();
      });
    })
  }

  addMembersToFamily(familyId:string, memberIds:string[]): Promise<Member> {
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
      userRef.update({
        memberIds: firebase.firestore.FieldValue.arrayUnion(memberIds)
      }).then(() => {
        resolve();
      });
    })
  }

  searchFamilies(name:string): Observable<Family>{
    return new Observable((subscriber) => {
      let familyRef:firebase.firestore.Query = firebase.firestore().collection('families').where('name', '>=', name);
      familyRef.get().then((querySnapshot:firebase.firestore.QuerySnapshot)=>{
        if(querySnapshot.size > 0){
          let counter = 1;
          querySnapshot.forEach((queryData:firebase.firestore.QueryDocumentSnapshot)=>{
            let family:Family = new Family().deserialize(queryData.data());
            family.uid = queryData.id;
            subscriber.next(family);
            this.fetchImage(family);
          })
        }
      })
    });
  }
}
