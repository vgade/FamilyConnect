import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  isSearchMember:boolean = true;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  searchChanged(event){
    let searchType= event.value;
    switch(searchType){
      case 'member':
        this.isSearchMember =true;
        break;
      case 'family':
        this.isSearchMember = false;
        break;
    }
  }

  cancelHandler(){
    this.router.navigate(['dashboard']);
  }
}
