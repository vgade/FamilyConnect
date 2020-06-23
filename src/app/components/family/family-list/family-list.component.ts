import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Family } from '@app/models/family.model';
import { FamilyService } from '@app/services/family/family.service';
import { Router } from '@angular/router';

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

  constructor(private familySer:FamilyService, private router:Router) { }

  ngOnInit(): void {
    if(!this.families){
      this.families = [];
    }
    
  }

  viewFamily(family:Family){
    if(!this.selectionMode){
      this.familySer.familyDetail = family;
      this.router.navigate(['family-detail']);
    }
  }

  searchFamilies(){
    this.searchFamily.emit(null);
  }

  familySelectionChange(event, family:Family){
    family.selected = event.checked;
  }


}
