import { Component, OnInit} from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { ExamData,Patient, massSpecifications } from 'src/app/shared/arb-project.model';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

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
    this.service.getOne(this.service.examDataId, 'examData').subscribe(res => {
      this.service.ExamData = res as ExamData;
    });
  }

  PDF(cond:string) {
    const exportedContent = document.getElementById('contentToConvert');
    html2canvas(exportedContent,{ scrollY: -window.scrollY , scrollX: window.scrollX}
      ).then(canvas => {
      const fileWidth = 180;
      const fileHeight = canvas.height * fileWidth / canvas.width;
      const fileURI = canvas.toDataURL()
      const PDF = new jspdf('p', 'mm', [200,300]);
      const position = 0;
      PDF.addImage(fileURI, 'PNG', 5, 5, fileWidth, 270)
      var output = PDF.output('blob');
      const formData = new FormData();
      formData.append('Image', output , `${this.service.examDataId}`);
      if(cond === 'download')
      {
        window.open(URL.createObjectURL(output));
      }
      if(cond === 'export')
      {
        this.http.post("http://localhost:57645/api/report",formData).subscribe(res=> res);
      }
    });
  }
}
