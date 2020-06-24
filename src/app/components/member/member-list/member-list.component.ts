import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Member } from '@app/models/member.model';
import { MemberService } from '@app/services/member/member.service';
import { Router } from '@angular/router';
import { Family } from '@app/models/family.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  @Input()
  title:string;

  @Input()
  selectionMode:boolean;

  @Input()
  removeMode:boolean;

  @Input()
  family:Family;

  @Input()
  members:Member[] = [];

  @Input()
  enableAddMember:boolean;

  @Output()
  searchMember: EventEmitter<any> = new EventEmitter<any>();

  constructor(private memberSer:MemberService, private router:Router) { }

  ngOnInit(): void {
    if(!this.members){
      this.members = [];
    }
  
  }

  viewMember(member:Member){
    if(!this.selectionMode){
      this.memberSer.memberDetail = member;
      this.router.navigate(['member-detail']);
    }
    
  }

  searchMembers(){
    this.searchMember.emit(null);
  }

  memberSelectionChange(event, member:Member){
    member.selected = event.checked;
  }

  memberRemove(member:Member){
    if(this.family.uid){
      this.memberSer.removeMember(this.family.uid, member).then((member:Member) => {
        this.members = this.members.filter((memberInp:Member) => {
          return member != memberInp;
        })
        this.family.members = this.members;
      })
    }else{
      this.members = this.members.filter((memberInp:Member) => {
        return member != memberInp;
      })
      this.family.members = this.members;
    }
  }

}
