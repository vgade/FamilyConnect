import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FamilyService } from '@app/services/family/family.service';
import { Family } from '@app/models/family.model';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-family',
  templateUrl: './search-family.component.html',
  styleUrls: ['./search-family.component.scss']
})
export class SearchFamilyComponent implements OnInit {

  @Output()
  selected:EventEmitter<Family[]> = new EventEmitter<Family[]>();
 
  @Output()
  cancel:EventEmitter<any> = new EventEmitter<any>();

  @Input()
  selectionMode:boolean;

  @Input()
  hideToolBar:boolean;

  families:Family[];

  constructor(private familySer:FamilyService, router:Router) { }

  ngOnInit(): void {
  }

  searchFamilies(event){
    let searchText:string = event.target.value;
    if(searchText.length >= 2){
      this.families = [];
      this.familySer.searchFamilies(searchText).then((families:Family[]) => {
        this.families = families;
      });
    }
    
  }

  viewFamily(){
    if(!this.selectionMode){

    }
  }

  cancelHandler(){
    this.cancel.emit();
  }

  doneSelection(){
    let selctedFamilies = this.families.filter((family:Family)=>{
      return family.selected;
    })
    this.selected.emit(selctedFamilies);
  }
}
