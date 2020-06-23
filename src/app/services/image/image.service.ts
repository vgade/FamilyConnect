import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  storageRef:firebase.storage.Reference;

  constructor() {}


   uploadImage(image: File, uid:string): Promise<firebase.storage.UploadTaskSnapshot>{
    return new Promise((resolve, reject) => {
      // Create a root reference
      this.storageRef = firebase.storage().ref();
      var dpsRef = this.storageRef.child(`dps/${uid}.jpg`);
      dpsRef.put(image).then((snapshot) => {
        resolve(snapshot);
      });
    })
  }

   getDownloadURL(path:string):Promise<string>{
     return new Promise((resolve, reject) => {
      this.storageRef = firebase.storage().ref();
      this.storageRef.child(path).getDownloadURL().then((url) => {
          resolve(url);
        }).catch((error) => {
          resolve(path);
        });
     })
  }}
