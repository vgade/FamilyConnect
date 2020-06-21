import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from '@environment/environment';
import { FirebaseService } from '@services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FamilyConnect';
  constructor(private firebaseService:FirebaseService){

  }

  ngOnInit(){
    firebase.initializeApp(environment.firebaseConfig);
    this.firebaseService.initializeAuthStateChange();
  }
}
