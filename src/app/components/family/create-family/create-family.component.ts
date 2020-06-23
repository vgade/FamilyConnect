import { Component, OnInit, Input, Output } from '@angular/core';
import { Family } from '@app/models/family.model';
import { FamilyService } from '@app/services/family/family.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-family',
  templateUrl: './create-family.component.html',
  styleUrls: ['./create-family.component.scss']
})
export class CreateFamilyComponent implements OnInit {

  @Input()
  back:string;
  
  @Output()
  family:Family;

  constructor(private familySer:FamilyService, private router:Router) { }

  ngOnInit(): void {
    this.family = new Family();
    this.family = this.family.deserialize(this.family);
  }

  createFamily(){
    this.familySer.createNewFamily(this.family).then(()=>{
      alert("Family Added Successfully");
      if(this.back){
        this.router.navigate([this.back]);
      }else{
        this.router.navigate(["dashboard"]);
      }
    })
  }

  cancel(){
    this.router.navigate(['dashboard'])
  }

}
