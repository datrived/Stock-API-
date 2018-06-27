import { Component, ElementRef, Input, OnInit  } from '@angular/core';

import { Http, Response } from '@angular/http';

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  
  filesToUpload: Array<File> = [];
  successMsg:String;
  constructor(private http: Http, private el: ElementRef) { }
  


  ngOnInit() {
    
  }

  upload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);

    for(let i =0; i < files.length; i++){
        formData.append("uploads[]", files[i], files[i]['name']);
    }
    console.log('form data variable :   '+ formData.toString());
    // formData.append("uploads[]", files[0], files[0]['name']);
    //this.address.documents = files.toString();

        this.http.post('/file', formData)
        .subscribe(res => {
          //this.router.navigate(['/books']);
          console.log(res);
          this.successMsg = "Success!";
        });
        //.map(files => files.json())
        //.subscribe(files => console.log(files));
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    //this.product.photo = fileInput.target.files[0]['name'];
    this.successMsg = "";
}
delete(){
    this.http.delete('/file').subscribe(res => {
      //this.router.navigate(['/books']);
      console.log(res);
      this.successMsg = "Success!";
    }, (err) => {
      console.log(err);
    }
  );
}
}
