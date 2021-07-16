import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
// import domtoimage from 'dom-to-image';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { ExamData, ClinicalInfo, GeneralInfo, FinalAssessment, Patient, massSpecifications } from 'src/app/shared/arb-project.model';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { title } from 'process';
import { buildDriverProvider } from 'protractor/built/driverProviders';
declare const google: any;
// import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  constructor(public service: ArbProjectService, private http: HttpClient, private router: Router) { }
  massSpecifications: massSpecifications[] = this.service.Patient.clinicalInfo.massSpecifications;
  BiRadslist=[]
  RecommendationList=[]
  examData: ExamData = new ExamData();
  patient: Patient = new Patient();
  lenght: number = 0;
  ngOnInit() {
    this.service.getCombo('GetBiRads')
    .subscribe(res => this.BiRadslist = res as []);
    this.service.getCombo('GetRecommendation')
    .subscribe(res => this.RecommendationList = res as []);

    
    console.log(this.massSpecifications.length)

    this.service.getOne(this.service.examDataId, 'examData').subscribe(res => {
      this.service.ExamData = res as ExamData;
      console.log(this.service.ExamData, this.service.Patient);
    });


  }

  // generatePDF() {
  //   // var data = document.getElementById('contentToConvert') as HTMLCanvasElement;
  //   // console.log(data)
  //   var data = document.getElementById("contentToConvert") as HTMLCanvasElement;
  //   console.log(data)
  //   html2canvas(data).then(canvas=>{
  //   var ctx = canvas.getContext("2d");
  //   let image = new Image();
  //   image.onload = () => {
  //     ctx.drawImage(
  //       image,
  //       0, //sx
  //       0, //sy
  //       208, //sw
  //       300, //sh
  //       0, //dx
  //       0, //dy
  //       canvas.width, //dw
  //       canvas.height //dh
  //     );
  //   };
  //   image.src = canvas.toDataURL();
  //   let pdf = new jspdf('p', 'mm', "a4");
  //   // var position = 0;
  //   pdf.addImage(image.src, 'PNG',0,0,208,300)
  //   var blob = pdf.output("blob");
  //   window.open(URL.createObjectURL(blob));
  //   });

  //   // html2canvas(data).then(canvas => {
  //   //   console.log(canvas.height)
  //   //   console.log(canvas.width)
  //   //   canvas.height = 900;
  //   //   canvas.width = 750;
  //   //   var imgWidth = 200;
  //   //   var imgHeight = canvas.height * 180 / canvas.width;
  //   //   // var imgHeight = 600;
  //   //   console.log(imgHeight)
  //   //   const contentDataURL = canvas.toDataURL('image/png')
  //   //   console.log(contentDataURL)
  //   //   let pdf = new jspdf('p', 'mm', [imgWidth,imgHeight]);
  //   //   // var position = 0;
  //   //   pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight)
  //   //   var blob = pdf.output("blob");
  //   //   window.open(URL.createObjectURL(blob));
  //   // });
  //   }

  PDF(cond:string) {
    const exportedContent = document.getElementById('contentToConvert');
    html2canvas(exportedContent,{ scrollY: -window.scrollY , scrollX: window.scrollX}
      ).then(canvas => {
      console.log(canvas.height)
      console.log(canvas.width)
      // 203
      const fileWidth = 180;
      const fileHeight = canvas.height * fileWidth / canvas.width;
      console.log(fileHeight) 
      const fileURI = canvas.toDataURL()
      // 225,505
      const PDF = new jspdf('p', 'mm', [200,300]);
      const position = 0;
      // 500
      PDF.addImage(fileURI, 'PNG', 5, 5, fileWidth, 270)
      // PDF.save("test.pdf");
      var output = PDF.output('datauristring');
      // console.log(output.type)
      // URL.createObjectURL(blob)
      // var binary = btoa(blob)
      // JSON.stringify(binary)
      // var newBlob = new Blob([blob.])
      
      const formData = new FormData();
      formData.append('Name', this.service.ExamData.patientID);
      formData.append('TileImage', output);
      // console.log(blob)

      
      if(cond === 'download'){
        window.open(URL.createObjectURL(output));
      }
      if(cond === 'export')
      {
        this.http.post("https://mrgf.azurewebsites.net/api/report",formData).subscribe(res=> console.log(res));
      }
      
      
    });
  }
 

}
