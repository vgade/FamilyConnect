import { Component, OnInit, Output, Input } from '@angular/core';
import { Member } from '@app/models/member.model';
import { MemberService } from '@app/services/member/member.service';
import { Router } from '@angular/router';
import { Family } from '@app/models/family.model';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent implements OnInit {

  @Output()
  member:Member;

  @Input()
  back:string;

  isSearchFamily:boolean = false;

  constructor(private memberSer:MemberService, private router:Router) { 
  }

  ngOnInit(): void {
    this.member = new Member();
    this.member = this.member.deserialize(this.member);
    this.member.families = [];
  }

  addMember(){
    this.memberSer.createNewMember(this.member).then(() => {
      alert("Member Added Successfully!");
      if(this.back){
        this.router.navigate([this.back]);
      }else{
        this.router.navigate(["dashboard"]);
      }
    });
  }

  cancel(){
    this.router.navigate(['dashboard'])
  }

  searchFamilies(){
    this.isSearchFamily = true;
  }

  familiesSelected(families:Family[]){
    this.member.familyIds = [];
    this.member.families = families;
    families.forEach((family:Family)=>{
      this.member.familyIds.push(family.uid);
    })
    this.isSearchFamily = false;
  }

  cancelAddFamily(){
    this.isSearchFamily = false;
  }

}
