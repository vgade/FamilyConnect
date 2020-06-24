import { Component, OnInit, Input, Output } from '@angular/core';
import { ImageService } from '@app/services/image/image.service';
import { EventEmitter } from 'protractor';
import { Member } from '@app/models/member.model';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  @Input()
  object:any;

  @Input()
  upload:boolean;

  uploading:boolean = false;

  selectedFile: File;

  constructor(private imageService: ImageService){}

  ngOnInit(): void {
  }

  processFile(event: any) {
    this.uploading = true;
    this.selectedFile = event.files[0];
    let randomtime:string = (new Date().getMilliseconds()).toString();
    this.imageService.uploadImage(this.selectedFile, this.object.uid? this.object.uid:randomtime).then((imageSnapshot:firebase.storage.UploadTaskSnapshot) => {
      this.object.pic = imageSnapshot.metadata.fullPath;
      this.uploading = false;
      this.imageService.getDownloadURL(this.object.pic).then((url) => {
        this.object.picUrl = url;
        if(this.object.uid){
          if(this.object instanceof Member){
            this.imageService.updateDp(this.object, 'members');
          }else{
            this.imageService.updateDp(this.object, 'families');
          }
        }
      });
    });
  }
}
