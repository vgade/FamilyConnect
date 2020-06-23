import { Component, OnInit } from '@angular/core';
import { Member } from '@app/models/member.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FamilyService } from '@app/services/family/family.service';
import { MemberService } from '@app/services/member/member.service';
import { Family } from '@app/models/family.model';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {

  member:Member;

  familySubscription:Subscription;

  isSearchFamily:boolean = false;
  constructor(private router:Router, private familySer:FamilyService, private memberSer:MemberService) { }

  ngOnInit(): void {
    this.member = this.memberSer.memberDetail;
    this.fetchFamilies();
  }

  searchFamilies(){
    this.isSearchFamily = true;
  }

  fetchFamilies(){
    this.member.families = [];
    let that = this;
    this.familySubscription = this.familySer.fetchFamiles(this.member.uid).subscribe({
      next : (family:Family)=>{
        that.member.families.push(family);
      }
    });
  }

  edit(){

  }

  cancel(){
    this.router.navigate(['dashboard']);
  }

  cancelAddFamily(){
    this.isSearchFamily = false;
  }

  familiesSelected(event){

  }

}
