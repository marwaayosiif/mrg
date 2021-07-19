import { Component, OnInit, OnDestroy } from '@angular/core';

// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';

import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Doctor, Login } from 'src/app/shared/arb-project.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  closeResult: string;
  public redirectUrl: string = 'dash/table-list';
  constructor(public service: ArbProjectService, private http: HttpClient, private router: Router, private modalService: NgbModal) { }
  
  Doctor: Doctor = new Doctor();
  Login: Login = new Login();
  flag: boolean = true;
  display='none'; //default Variable
  // content: string;

  
  ngOnInit() {
  }
  
  open(content) {
    console.log(name);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = ` ${result}`;},
  }
 
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return '';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return '';
  //   } else {
  //     return ` ${reason}`;
  //   }
  // }

//  openModalDialog(){
//     this.display='block'; //Set block css
//  }

//  closeModalDialog(){
//   this.display='none'; //set none css after close dialog
//  }
 
  OnSubmit(form: NgForm,data:string,content) {
    this.service.PostLogin().subscribe(
      res => {
        console.log(res);
        if (res == "wrong password" || res == "Not Found" || res == "Error") {
          this.flag = false;
          this.open(content)

        }
        else {
          console.log(res['id']);
          this.service.Doctor = res as Doctor
          this.service.DoctorId = res['id'];
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
          this.flag = true;

        }

      }
      ,
  err=>{
  console.log("Not found send error msg");
})
    };
  
  }
