import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '@services/authenticate/authenticate.service';
import { Member } from '@app/models/member.model';
import { Family } from '@app/models/family.model';
import { Router } from '@angular/router';
import { FamilyService } from '@app/services/family/family.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user:Member;
  favourites:Member[] =[];
  families:Family[] = [];

  constructor(private authenticateService:AuthenticateService, private router:Router,
    private familySer:FamilyService) { }

  ngOnInit(): void {
    this.user = this.authenticateService.loggedInUser;
    this.fetchFavourites();
    this.fetchFamilies();
  }

  fetchFavourites(){

  }

  fetchFamilies(){
    let that = this;
    this.familySer.fetchFamiles(this.authenticateService.loggedInUser.uid).subscribe(
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
    this.router.navigate(["add-family"]);
  }

  addMember(){

  }

  viewMember(member:Member){

  }

  viewFamily(family:Family){

  }

  signOut(){
    this.authenticateService.signOut();
  }

}
