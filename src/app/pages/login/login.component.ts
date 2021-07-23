import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ArbProjectService } from 'src/app/shared/arb-project.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Doctor, Login } from 'src/app/shared/arb-project.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  showModal: boolean;
  display='none';
  
  ngOnInit() {
  }
  
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = ` ${result}`;
    }, (reason) => {
      this.closeResult = ` ${this.getDismissReason(reason)}`;
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
  show()
  {
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }


  OnSubmit(form: NgForm,data:string) {
    this.service.PostLogin().subscribe(
      res => {
        if (res == "Wrong password" || res == "Not Found" || res == "Error") {
          this.flag = false;
          this.show()
        }
        else {
          this.service.Doctor = res as Doctor
          this.service.DoctorId = res['id'];
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
          this.flag = true;
        }
      })
      };
  
  }
