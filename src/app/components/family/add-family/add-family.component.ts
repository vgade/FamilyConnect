import { Component, OnInit } from '@angular/core';
import { Family } from '@app/models/family.model';
import { FamilyService } from '@app/services/family/family.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html',
  styleUrls: ['./add-family.component.scss']
})
export class AddFamilyComponent implements OnInit {

  family:Family;

  constructor(private familySer:FamilyService, private router:Router) { }

  ngOnInit(): void {
    this.family = new Family();
    this.family.pic = "../../../../assets/images/family-default.png";
  }

  addFamily(){
    this.familySer.addNewFamily(this.family).then(()=>{
      alert("Family Added Successfully");
      this.router.navigate(["dashboard"]);
    })
  }

}
