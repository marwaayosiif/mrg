import { Component, OnInit } from '@angular/core';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import {HttpClient} from "@angular/common/http";
import { ExamData,Patient} from 'src/app/shared/arb-project.model';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal  } from '@ng-bootstrap/ng-bootstrap';


@Component({
  
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})

export class TableListComponent implements OnInit {
  
  name : string;
  closeResult: string;
  redirectUrl: string = '/dash/preselect';
  constructor(public service:ArbProjectService  ,private http:HttpClient, private router:Router, private modalService: NgbModal) { 
    
  }
  open(content1,content2,patientname:number) {
    this.http.get(`https://mrgs.azurewebsites.net/api/report/${patientname}`).subscribe(res=> {
      var retrievedImage = 'data:image/jpeg;base64,' + res;
      if (res != "Not Found"){
        this.pdfScr = retrievedImage
        this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = ` ${result}`;
        }, (reason) => {
          this.closeResult = ` ${this.getDismissReason(reason)}`;
        });
      }
      else {
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
  searchText;
  ngOnInit() {
    let doctorId = this.service.DoctorId;
    this.service.getExamDataOfDoctor(doctorId,'examData/ExamDataOfDoctor').subscribe(res=>{this.service.list = res as ExamData[]})
  }
 
  preselect(id:number){
    this.service.examDataId = id ;
    this.service.tabs = [];
    this.service.getPatient(this.service.examDataId,'Patient','examId').subscribe(res =>{
      if (res != null && res != "Not Found"){
      this.service.Patient = res as Patient
      this.service.PatientId = res['id'];
      this.service.index = this.service.Patient.clinicalInfo.massSpecifications.length ;
      for (let i = 1 ; i <= this.service.index; i++){
        this.service.tabs.push('Mass' + i);
      }
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    }  
       },err=>{
        this.service.index = 0;
        this.service.Patient = new Patient();
        this.router.navigate([this.redirectUrl]);
       });
  }

  patientForm(id:number){
    this.service.ExamData.id = id;
    this.service.getExamDataOfDoctor(id,'examData').subscribe(res=>{
      this.service.ExamData = res as ExamData
    })
    this.router.navigate(['dash/patient']);
  }

  Search(){
    if(this.name != ""){
      this.service.list = this.service.list.filter(res =>{
        return res.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      });
    }
    else if(this.name == ""){
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
      })
    }
  }

  refreshList() {
    this.service.getExamDataOfDoctor(this.service.DoctorId,'examData/ExamDataOfDoctor').subscribe(res=>{
      this.service.list = res as ExamData[]
    })
  }
}