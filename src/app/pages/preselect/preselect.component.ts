import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import {image,GeneralInfo, ClinicalInfo, FinalAssessment} from 'src/app/shared/arb-project.model';


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
  constructor(public service: ArbProjectService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
   }
   retrievedImage:any
  ngOnInit(): void {
    this.http.get(`https://mrgs.azurewebsites.net/api/image/${this.service.examDataId}`).subscribe(res => {
      for(var file of res as Array<string> )
      {
      this.retrievedImage = 'data:image/jpeg;base64,' + file;
      this.urls.push(this.retrievedImage);
      }
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
      this.postFile(this.file).subscribe(data => { 
       });
    }
  }

  postFile(fileToUpload: File) {
    const endpoint = 'https://mrgs.azurewebsites.net/api/image';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, `${this.service.examDataId}`);
    return this.http
      .post(endpoint, formData);
  }



  private deleteImage(url: any, i: number, event): void {
      this.urls = this.urls.filter((a) => a !== url);
      this.files = this.files.filter((a) => a !== this.files[i]);
      this.http.delete(`https://mrgs.azurewebsites.net/api/image/${this.service.examDataId}/${i}`).subscribe(res => {
      })
  }




  OnSubmit(form: NgForm, data: string) {

    this.service.Post(data).subscribe(
      res => {
        this.resetForm(form, data);
      })
  }
  resetForm(form: NgForm, data: string) {
    form.form.reset();
    this.service.GeneralInfo = new GeneralInfo();
    this.service.FinalAssessment = new FinalAssessment();
    this.service.ClinicalInfo = new ClinicalInfo();

  }

}
