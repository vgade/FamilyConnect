import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Family } from '@app/models/family.model';
import { FamilyService } from '@app/services/family/family.service';
import { MemberService } from '@app/services/member/member.service';
import { Subscription } from 'rxjs';
import { Member } from '@app/models/member.model';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent implements OnInit {

  family:Family;
  isSearchMember:boolean;
  memberSubscription:Subscription;

  constructor(private router:Router, private familySer:FamilyService, private memberSer:MemberService) { }

  ngOnInit(): void {
    this.family = this.familySer.familyDetail;
    this.fetchMembers();
  }

  fetchMembers(){
    this.family.members = [];
    let that = this;
    this.memberSubscription = this.memberSer.fetchMembers(this.family.uid).subscribe({
      next : (member:Member)=>{
        that.family.members.push(member);
      }
    });
  }

  edit(){

  }

  membersSelected(members:Member[]){
    this.memberSer.membersSelected(members, this.family.uid).then(() => {
      this.fetchMembers();
      this.isSearchMember = false;
    })
  }

  cancelAddMember(){
    this.isSearchMember = false;
  }

  searchMembers(){
    this.isSearchMember = true;
  }

  cancel(){
    this.router.navigate(['dashboard']);
  }

}
