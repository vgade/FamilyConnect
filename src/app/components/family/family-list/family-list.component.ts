import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Family } from '@app/models/family.model';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.scss']
})
export class FamilyListComponent implements OnInit {

  @Input()
  title:string;

  @Input()
  selectionMode:boolean;

  @Input()
  families:Family[] = [];

  @Input()
  enableAddFamily:boolean;

  @Output()
  searchFamily: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    if(!this.families){
      this.families = [];
    }
    
  }

  viewFamily(family:Family){

  }

  searchFamilies(){
    this.searchFamily.emit(null);
  }

  familySelectionChange(event, family:Family){
    family.selected = event.checked;
  }


}
