import { Injectable } from '@angular/core';
import { Member } from '@app/models/member.model';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { Family } from '@app/models/family.model';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  memberDetail:Member;
  searchSubs:Subscription;

  constructor(private imageService:ImageService) { }

  updateMember(){

  }

  createNewMember(member:Member) :Promise<Member>{
    delete member.families;
    delete member.picUrl;
    delete member.favourites;

    return new Promise((resolve, reject) => {
      firebase.firestore().collection('members').add(JSON.parse(JSON.stringify(member))).then((memberData)=>{
        member.familyIds.forEach((familyId) => {
          let familyRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
          // Atomically add a new region to the "regions" array field.
          familyRef.update({
            memberIds: firebase.firestore.FieldValue.arrayUnion(memberData.id)
          });
        });
        resolve();
      });
    })
  }

  addNewMembers(familyId:string, memberIds:string[]): Promise<Member> {
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
      userRef.update({
        memberIds: firebase.firestore.FieldValue.arrayUnion(...memberIds)
      }).then(() => {
        memberIds.forEach((memberId:string) => {
          this.addFamiliesToMember(memberId, [familyId]);
        })
        resolve();
      });
    })
  }

  addFamiliesToMember(memberId:string, families:string[]): Promise<Member> {
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
      userRef.update({
        familyIds: firebase.firestore.FieldValue.arrayUnion(...families)
      }).then(() => {
        resolve();
      });
    })
  }

  fetchMembers(familyId:string):Observable<Member>{
    let familyRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
    return new Observable( subscriber =>{
      familyRef.get().then((querySnapshot)=>{
        let family:Family = new Family();
        family.deserialize(querySnapshot.data());
        if(family.memberIds && family.memberIds.length > 0){
          family.memberIds.forEach((memberId:string) => {
            let memberRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
            memberRef.get().then((queryData) => {
              let member:Member = new Member();
              member.deserialize(queryData.data());
              member.uid = queryData.id;
              subscriber.next(member);
              this.fetchImage(member);
            });
          });
        }
      });
    });
  }

  addNewFavourites(memberId:string, memberIds:string[]): Promise<Member> {
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
      userRef.update({
        favourites: firebase.firestore.FieldValue.arrayUnion(...memberIds)
      }).then(() => {
        resolve();
      });
    })
  }

  fetchFavourites(userId:string):Observable<Member>{
    let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(userId);
    return new Observable( subscriber =>{
      userRef.get().then((querySnapshot)=>{
        let member:Member = new Member();
        member.deserialize(querySnapshot.data());
        if(member.favourites && member.favourites.length > 0){
          member.favourites.forEach((memberId:string) => {
            let memberRef:firebase.firestore.DocumentReference = firebase.firestore().collection('members').doc(memberId);
            memberRef.get().then((queryData) => {
              let member:Member = new Member();
              member.deserialize(queryData.data());
              member.uid = queryData.id;
              subscriber.next(member);
              this.fetchImage(member);  
            });
          });
        }
      });
    });
  }

  fetchAllMembers(): Observable<Member>{
    return new Observable((subscriber) => {
      let memberRef:firebase.firestore.Query = firebase.firestore().collection('members');
      memberRef.get().then((querySnapshot:firebase.firestore.QuerySnapshot)=>{
        if(querySnapshot.size > 0){
          let counter = 1;
          querySnapshot.forEach((queryData:firebase.firestore.QueryDocumentSnapshot)=>{
            let member:Member = new Member().deserialize(queryData.data());
            member.uid = queryData.id;
            counter++;
            subscriber.next(member);
            this.fetchImage(member);
            if(counter > querySnapshot.size){
              subscriber.complete();
            }
          })
        }
      })
    });
  }

  searchMembers(name:string): Promise<Member[]>{
    let members:Member[] = [];
    return new Promise((resolve, reject) => {
      this.searchSubs = this.fetchAllMembers().subscribe({
        next: (member) => {
          members.push(member);
        },
        complete: () =>{
          members = members.filter((member:Member) => {
            let firstName:string = member.firstName.toLowerCase();
            let lastName:string = member.lastName.toLowerCase();
            name = name.toLowerCase();
            return firstName.indexOf(name) !== -1 || lastName.indexOf(name) !== -1;
          })
          resolve(members);
          this.searchSubs.unsubscribe();
        }
      })
    })
  }

  fetchImage(member:Member){
    if(member.pic.indexOf('default') !== -1){
      member.picUrl = member.pic;
    }else{
      this.imageService.getDownloadURL(member.pic).then((url) => {
        member.picUrl = url;
      })
    }
  }

  membersSelected(members:Member[], uid:string): Promise<any>{
    return new Promise((resolve, reject) => {
      let newMemberIds:string[]=[];
      members.forEach((member:Member)=>{
        newMemberIds.push(member.uid);
      });
      this.addNewMembers(uid, newMemberIds).then(() => {
        alert("Favourites Members Added Successfully");
        resolve();
      });
    });
  }

  removeMember(familyId:string, member:Member): Promise<Member>{
    return new Promise((resolve, reject) => {
      let userRef:firebase.firestore.DocumentReference = firebase.firestore().collection('families').doc(familyId);
      userRef.update({
        memberIds: firebase.firestore.FieldValue.arrayRemove(...[member.uid])
      }).then(() => {
        resolve(member);
      });
    })
  }
}
