import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import { ExamData } from 'src/app/shared/arb-project.model';

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {


  constructor(public service:ArbProjectService,private http:HttpClient) { }

  list:ExamData[];
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  showModal: boolean;


 ExamData:ExamData = new ExamData();
 hey:ExamData = new ExamData
 
  ngOnInit() {

    if(this.service.ExamData.id !== 0){
      this.service.getOne(this.service.ExamData.id,'ExamData').subscribe(res =>this.service.ExamData = res as ExamData) 
    }
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });
    
    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
  show()
  {
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }
  OnSubmit(form:NgForm,data:string){
    this.service.ExamData.doctorId = this.service.DoctorId;
    if(this.service.ExamData.id == 0)
        this.insertRecord(form,data);
    else
        this.updateRecord(form,data); 
    
    this.show()
}

insertRecord(form:NgForm,data:string){
  this.service.Post(data).subscribe(
    res=>{
      this.service.index = 0;
      this.resetForm(form);
    })
}
updateRecord(form:NgForm,data:string){
  this.service.Put(data).subscribe(
    res=>{
      this.resetForm(form);
    });
}

refreshList() {
  this.http.get(this.service.examDataUrl)
    .toPromise()
    .then(res =>this.list = res as ExamData[]);
}

resetForm(form: NgForm) {
  form.form.reset();
}

}
