import { Injectable } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Family } from '@app/models/family.model';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Member } from '@app/models/member.model';
import { Observable, Subscription } from 'rxjs';
import { ImageService } from '@services/image/image.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  familyDetail:Family;
  searchSubs:Subscription;

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
        memberIds: firebase.firestore.FieldValue.arrayUnion(...memberIds)
      }).then(() => {
        resolve();
      });
    })
  }

  fetchAllFamilies(): Observable<Family>{
    return new Observable((subscriber) => {
      let familyRef:firebase.firestore.Query = firebase.firestore().collection('families');
      familyRef.get().then((querySnapshot:firebase.firestore.QuerySnapshot)=>{
        if(querySnapshot.size > 0){
          let counter = 1;
          querySnapshot.forEach((queryData:firebase.firestore.QueryDocumentSnapshot)=>{
            let family:Family = new Family().deserialize(queryData.data());
            family.uid = queryData.id;
            counter++;
            subscriber.next(family);
            this.fetchImage(family);
            if(counter > querySnapshot.size){
              subscriber.complete();
            }
          })
        }
      })
    });
  }

  searchFamilies(name:string): Promise<Family[]>{
    let families:Family[] = [];
    return new Promise((resolve, reject) => {
      this.searchSubs = this.fetchAllFamilies().subscribe({
        next: (family:Family) => {
          families.push(family);
        },
        complete: () =>{
          families = families.filter((familiy:Family) => {
            let familyName:string = familiy.name.toLowerCase();
            name = name.toLowerCase();
            return familyName.indexOf(name) !== -1;
          })
          resolve(families);
          this.searchSubs.unsubscribe();
        }
      })
    })
  }

  familiesSelected(families:Family[], uid:string):Promise<any>{
    return new Promise((resolve, reject) => {
      let newFamilyIds:string[]=[];
      families.forEach((family:Family)=>{
        newFamilyIds.push(family.uid);
      });
      this.addNewFamilies(uid, newFamilyIds).then(() => {
        alert("Families Added Successfully");
        resolve();
      });
    });
  }

  removeFamily(memberId:string, family:Family): Promise<Family>{
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
      userRef.update({
        familyIds: firebase.firestore.FieldValue.arrayRemove(...[family.uid])
      }).then(() => {
        resolve(family);
      });
    })
  }
}
