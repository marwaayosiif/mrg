import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import {PatientComponent} from 'src/app/pages/patient/patient.component'
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError ,of } from 'rxjs';
import { catchError, retry ,map } from 'rxjs/operators';
import { ExamData,ClinicalInfo,GeneralInfo,FinalAssessment,Patient} from 'src/app/shared/arb-project.model';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {
  name : string;
  closeResult: string;
  redirectUrl: string = '/dash/preselect';
  constructor(public service:ArbProjectService  ,private http:HttpClient, private router:Router, private modalService: NgbModal) { }
  
  // fileExists(url: string): Observable<string> {
  //   const folderPath = url;
  //   return this.http.get(url, { observe: 'response', responseType: 'blob' }).pipe(map(
  //     res => {
  //       return folderPath;
  //     }),
  //   catchError(error => {
  //     return of(error);
  //   })
  //   )}

  open(content1,content2,patientname:string) {
    // console.log(name);
    // this.pdfScr = '';
    // this.Test = `assets/${name}.pdf`;
    // this.http.get("").subscribe(res=>{
    //   var coded = res;
    // })
    console.log(`https://mrgf.azurewebsites.net/api/report/${patientname}`)
    this.http.get(`https://mrgf.azurewebsites.net/api/report/${patientname}`).subscribe(res=> {
      let result = res;
      if (result){
        URL.createObjectURL(result)
        this.pdfScr = URL.createObjectURL(result)
        this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = ` ${result}`;
        }, (reason) => {
          this.closeResult = ` ${this.getDismissReason(reason)}`;
        });
      }
      else{
        this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = ` ${result}`;
        }, (reason) => {
          this.closeResult = ` ${this.getDismissReason(reason)}`;
        });
      }
    });
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return '';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return '';
    } else {
      return ` ${reason}`;
    }
  }
  
  onClick(route){
    this.service.ExamData = new ExamData();
    this.router.navigate([route])

  }
  ExamData:ExamData = new ExamData();
  list:ExamData[]
  pdfScr:string = '';
  Test:string = '';
  focus:Boolean = false;
  ngOnInit() {
    let doctorId = this.service.DoctorId;
    this.service.getExamDataOfDoctor(doctorId,'examData/ExamDataOfDoctor').subscribe(res=>{this.service.list = res as ExamData[],console.log(res)})
    if (this.service.DoctorId !=0)
    {
      console.log(this.service.DoctorId)
    }
  }
 
  preselect(id:number){
    console.log(this.list)
    this.service.examDataId = id ;
    this.service.tabs = [];
    this.service.getPatient(this.service.examDataId,'Patient','examId').subscribe(res =>{
      if (res != null && res != "Not Found"){
      this.service.Patient = res as Patient
      this.service.PatientId = res['id'];
      console.log("gbtha");
      console.log(this.service.Patient.clinicalInfo.massSpecifications);
      this.service.index = this.service.Patient.clinicalInfo.massSpecifications.length ;
      for (let i = 1 ; i <= this.service.index; i++){
        this.service.tabs.push('Mass' + i);
      }
      console.log(this.service.tabs);
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    
    }  
       },err=>{
        this.service.index = 0;
        console.log(err);
        this.service.Patient = new Patient();
        this.router.navigate([this.redirectUrl]);
        
       });
       
    
  }
  patientForm(id:number){
    this.service.ExamData.id = id;
    this.service.getExamDataOfDoctor(id,'examData').subscribe(res=>{
      this.service.ExamData = res as ExamData
      console.log(res);
    })
    console.log("eeeh p2a mna fe el edit ahw");
    this.router.navigate(['dash/patient']);
  }
  Search(){
    if(this.name != ""){
      this.service.list = this.service.list.filter(res =>{
        return res.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      });

    }else if(this.name == ""){
      this.ngOnInit();

    }
    
  }
  DeleteOn(id:number){
   
    if (confirm('Are You Sure You Want To Delete?'))
    {
      this.service.Delete('ExamData',id)
      .subscribe(
      res =>{
        this.service.list = [];
        this.refreshList();
       
      },
      err =>{console.log(err)}
    )
    
    }
  }

  refreshList() {
    this.service.getExamDataOfDoctor(this.service.DoctorId,'examData/ExamDataOfDoctor').subscribe(res=>{
      this.service.list = res as ExamData[]
    })
    

  }
}