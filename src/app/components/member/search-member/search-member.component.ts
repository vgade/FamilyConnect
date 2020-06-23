import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MemberService } from '@app/services/member/member.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from '@app/models/member.model';

@Component({
  selector: 'app-search-member',
  templateUrl: './search-member.component.html',
  styleUrls: ['./search-member.component.scss']
})
export class SearchMemberComponent implements OnInit {

  @Output()
  selected:EventEmitter<Member[]> = new EventEmitter<Member[]>();
 
  @Output()
  cancel:EventEmitter<any> = new EventEmitter<any>();

  @Input()
  selectionMode:boolean;

  members:Member[];

  searchSubscription:Subscription;

  constructor(private memberSer:MemberService, router:Router) { }

  ngOnInit(): void {
  }

  searchMembers(event){
    if(this.searchSubscription){
      this.searchSubscription.unsubscribe();
    }
    let searchText:string = event.target.value;
    if(searchText.length >= 2){
      this.members = [];
      this.searchSubscription = this.memberSer.searchMembers(searchText).subscribe({
        next: (member:Member)=>{
          this.members.push(member);
        }
      });
    }
    
  }

  viewMember(){
    if(!this.selectionMode){

    }
  }

  cancelHandler(){
    this.cancel.emit();
  }

  doneSelection(){
    let selectedMembers = this.members.filter((member:Member)=>{
      return member.selected;
    })
    this.selected.emit(selectedMembers);
  }

}
