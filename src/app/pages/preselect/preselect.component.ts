import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import { HttpClient } from "@angular/common/http";
import {
  ExamData, Patient, Doctor, image,
  GeneralInfo, ClinicalInfo, FinalAssessment, Login, features
} from 'src/app/shared/arb-project.model';


@Component({
  selector: 'preselect-icons',
  templateUrl: './preselect.component.html',
  styleUrls: ['./preselect.component.scss']
})
export class PreselectComponent implements OnInit {
  tabs = ['General Information', 'Clinical Information', 'Final Assesment'];
  selected = new FormControl(0);
  tabtitle: string = '';
  image = new image();
  createProduct: boolean;
  message: string;
  ImageURL: string = null;
  fileToUpload: File | null = null;
  file: File = null;
  THEfile: File = null;
  fileToUploads = new Array<File>();
  sanitization: any;
  urls = new Array<string>();
  Base64 = new Array<string>();
  files = new Array<File>();
  FilesToRemove = new Array<File>();
  try: File = null;
  _albums = [];
  title = 'angulartoastr';
  showModal: boolean;
  myurl:string;
  show(url)
  {
    this.showModal = true; // Show-Hide Modal Check
    this.myurl = url;
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }
  
  onCreateProduct() {
    this.createProduct = true;
    this.message = '';
  }

  onProductSubmit(data) {
    this.createProduct = false;
    this.message = data.message;
    // console.log(this.message)
  }

  constructor(public service: ArbProjectService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
   }
   retrievedImage:any
  ngOnInit(): void {
    this.http.get(`http://localhost:57645/api/image/${this.service.examDataId}`).subscribe(res => {
      for(var file of res as Array<string> )
      {
      this.retrievedImage = 'data:image/jpeg;base64,' + file;
      this.urls.push(this.retrievedImage);
      }
    }, err => {
      console.log(err);
    });

  }

  handleFileInput(event) {
    
    this.fileToUploads = event.target.files;
    if (this.fileToUploads) {
      for (var image of this.fileToUploads) {
        this.files.push(image);
      }
    }
    if (this.fileToUploads) {
      for (this.THEfile of this.files) {

        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(this.THEfile);
      }
    }
  }
  OnSubmitImage(Image) {
    for (this.file of this.files) {
      // console.log(this.file)
      this.postFile(this.file).subscribe(data => { 
        // console.log(data)
       });

    }
    // this.postFile(this.fileToUpload).subscribe(data=>{console.log(data)});
  }

  postFile(fileToUpload: File) {
    const endpoint = 'http://localhost:57645/api/image';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, `${this.service.examDataId}`);

    return this.http
      .post(endpoint, formData);
  }



  private deleteImage(url: any, i: number, event): void {
    // console.log(i)
    // if (url.length > 10000) {
      this.urls = this.urls.filter((a) => a !== url);
      this.files = this.files.filter((a) => a !== this.files[i]);
      this.http.delete(`http://localhost:57645/api/image/${this.service.examDataId}/${i}`).subscribe(res => {
        // console.log(res)
      })
    // }

  }




  OnSubmit(form: NgForm, data: string) {

    this.service.Post(data).subscribe(
      res => {
        console.log("data",data)
        console.log("res",res)
        this.resetForm(form, data);
      },
      err => {
        console.log(err);
      }
    )
  }
  resetForm(form: NgForm, data: string) {
    form.form.reset();
    this.service.GeneralInfo = new GeneralInfo();
    this.service.FinalAssessment = new FinalAssessment();
    this.service.ClinicalInfo = new ClinicalInfo();

  }

}





  // addTab(selectAfterAdding: boolean) {

  //   if(this.tabtitle != ''){
  //       this.tabs.push(this.tabtitle);
  //   }else{
  //       this.tabs.push('New');
  //   }

  //   this.tabtitle = '';

  //   if (selectAfterAdding) {
  //     this.selected.setValue(this.tabs.length - 1);
  //   }
  // }

  // removeTab(index: number) {
  //   this.tabs.splice(index, 1);
  // }