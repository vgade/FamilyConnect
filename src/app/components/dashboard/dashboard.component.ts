import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Member } from '@app/models/member.model';
import { Family } from '@app/models/family.model';
import { Router } from '@angular/router';
import { FamilyService } from '@app/services/family/family.service';
import { FirebaseService } from '@app/services/firebase/firebase.service';
import { MemberService } from '@app/services/member/member.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAddFamily:boolean = false;
  isAddMember:boolean = false
  user:Member;
  favourites:Member[] =[];
  families:Family[] = [];

  favSubs:Subscription;
  familySubs:Subscription;

  constructor(private authenticateService:AuthenticateService, private router:Router,
    private familySer:FamilyService, private firebaseService:FirebaseService, private memberSer:MemberService) { }

  ngOnInit(): void {
    this.user = new Member();
    this.initializeDashboard()
    this.firebaseService.userAuthenticated$.subscribe(() => {
      this.initializeDashboard()
    });
  }

  initializeDashboard(){
    if(this.authenticateService.isSignedIn){
      this.user = this.authenticateService.loggedInUser;
      this.fetchFavourites();
      this.fetchFamilies();
    }
  }

  fetchFavourites(){
    if(this.favSubs){
      this.favSubs.unsubscribe();
    }
    this.favourites = [];
    let that = this;
    this.favSubs = this.memberSer.fetchFavourites(this.authenticateService.loggedInUser.uid).subscribe(
      {
        next(member:Member) { 
          that.favourites.push(member);
        },
        error(err) { console.error('something wrong occurred: ' + err); },
        complete() { console.log('done'); }
      }
    );
  }

  fetchFamilies(){
    if(this.familySubs){
      this.familySubs.unsubscribe();
    }
    this.families = [];
    let that = this;
    this.familySubs = this.familySer.fetchFamiles(this.authenticateService.loggedInUser.uid).subscribe(
      {
        next(family:Family) { 
          that.families.push(family);
        },
        error(err) { console.error('something wrong occurred: ' + err); },
        complete() { console.log('done'); }
      }
    );
  }

  addFamily(){
    this.router.navigate(["create-family"]);
  }

  addMember(){
    this.router.navigate(["create-member"]);
  }

  viewMember(member:Member){

  }

  searchFamilies(){
    this.isAddFamily = true;
  }

  searchMembers(){
    this.isAddMember = true;
  }
  
  familiesSelected(families:Family[]){
    this.familySer.familiesSelected(families, this.authenticateService.loggedInUser.uid).then(()=>{
      this.fetchFamilies();
      this.isAddFamily = false;
    })
  }

  membersSelected(members:Member[]){
    let newMemberIds:string[]=[];
    members.forEach((member:Member)=>{
      newMemberIds.push(member.uid);
    });
    this.memberSer.addNewFavourites(this.authenticateService.loggedInUser.uid, newMemberIds).then(() => {
      alert("Favourites Members Added Successfully");
      this.fetchFavourites();
    });
    this.isAddMember = false;
  }

  search(){
    this.router.navigate(['search']);
  }

  cancelAddFamily(){
    this.isAddFamily = false;
  }

  cancelAddMember(){
    this.isAddMember = false;
  }

  signOut(){
    this.authenticateService.signOut();
  }

}
