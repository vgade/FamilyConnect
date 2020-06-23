import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Member } from '@app/models/member.model';

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
  members:Member[] = [];

  @Input()
  enableAddMember:boolean;

  @Output()
  searchMember: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    if(!this.members){
      this.members = [];
    }
  
  }

  viewMember(family:Member){

  }

  searchMembers(){
    this.searchMember.emit(null);
  }

  memberSelectionChange(event, member:Member){
    member.selected = event.checked;
  }


}
