import {Component,OnInit } from '@angular/core';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import { ClinicalInfo, GeneralInfo ,FinalAssessment,Patient} from 'src/app/shared/arb-project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabset-selectbyid',
  templateUrl: './tabset-selectbyid.html',
  styleUrls: ['./tabset-selectbyid.css']
})
export class NgbdTabsetSelectbyid  implements OnInit{
 

  constructor(public service:ArbProjectService,private http:HttpClient,  private router:Router) {}
  
  onClick(route,id:number){
    this.router.navigate([route])
  }
  patientName:any
  ClinicalInfo:ClinicalInfo = new ClinicalInfo();
  GeneralInfo:GeneralInfo= new GeneralInfo();
  Patient:Patient = new Patient();
  general : GeneralInfo[]
  BiRadslist=[]
  RecommendationList=[]
  Asymmetries=[]
  MassMargin=[]
  MassDensities=[]
  Quadrants=[]
  ClockFaces=[]
  ClacificationTypicallyBenign=[]
  ClacificationSuspiciousMorphology=[]
  ClacificationDistribution=[]

  ngOnInit(): void {
    
    this.service.getCombo('GetBiRads')
    .subscribe(res => this.BiRadslist = res as []);
    this.service.getCombo('GetRecommendation')
    .subscribe(res => this.RecommendationList = res as []);
    this.service.getCombo('GetMassMargin')
    .subscribe(res => this.MassMargin = res as []);
    this.service.getCombo('GetMassDensities')
    .subscribe(res =>  this.MassDensities = res as []);
    this.service.getCombo('GetAsymmetries')
    .subscribe(res =>  this.Asymmetries = res as []);
    this.service.getCombo('GetQuadrants')
    .subscribe(res =>  this.Quadrants = res as []);
    this.service.getCombo('GetClockFaces')
    .subscribe(res =>  this.ClockFaces = res as []);
    this.service.getCombo('GetClacificationTypicallyBenign')
    .subscribe(res =>  this.ClacificationTypicallyBenign = res as []);
    this.service.getCombo('GetClacificationSuspiciousMorphology')
    .subscribe(res =>  this.ClacificationSuspiciousMorphology = res as []);
    this.service.getCombo('GetClacificationDistribution')
    .subscribe(res =>  this.ClacificationDistribution = res as []);
    for(var exam of this.service.list){
      if(exam.id == this.service.examDataId){
        this.patientName = exam.name
      }
    }
  }
  
  OnSubmit(form:NgForm,data:string){


    this.service.Patient.doctorId = this.service.DoctorId;
    this.service.Patient.examDataId = this.service.examDataId;
    this.service.Patient.clinicalInfo.featureId = this.service.PatientId;
    if ((this.service.Patient.generalInfo.id == 0) && (this.service.Patient.clinicalInfo.id == 0) && (this.service.Patient.finalAssessment.id == 0)){
        this.InsertFeatures(form,data);
    }
    else {
        this.UpdateFeatures(form,data);
        let mass_Spec = this.service.Patient.clinicalInfo.massSpecifications['id'];
    }

  }

  passingPatienId(id:number)
  {
    this.service.PatientId = id;
  }
  InsertFeatures(form:NgForm,data:string){
    this.service.Post(data).subscribe(
      res=>{
        this.service.PatientId = res['id'];
        this.service.Patient = res as Patient;
      })
  }
  UpdateFeatures(form:NgForm,data:string){
    this.service.Put(data).subscribe(
      res=>{
        this.resetForm(form,data);
        this.service.Patient = res as Patient; 
      }
  );
  }
  resetForm(form: NgForm,data:string) {
    this.service.GeneralInfo = new GeneralInfo();
    this.service.FinalAssessment = new FinalAssessment();
    this.service.ClinicalInfo = new ClinicalInfo();
  }
}