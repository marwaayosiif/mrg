import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { PatientComponent } from '../../pages/patient/patient.component';
import { PreselectComponent } from '../../pages/preselect/preselect.component';
import { ReportComponent } from '../../pages/report/report.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TableListComponent } from '../../pages/table-list/table-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import{NgbdTabsetSelectbyid} from '../../pages/preselect/tabset-selectbyid'
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {NgxGalleryModule} from '@kolkov/ngx-gallery';
import{MassComponent}from'../../pages/preselect/mass.component'
import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
    PdfViewerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    NgxGalleryModule
  ],
  declarations: [
    PatientComponent,
    UserProfileComponent,
    TableListComponent,
    PreselectComponent,
    ReportComponent,
    NgbdTabsetSelectbyid,
    MassComponent,
  ]
})

export class AdminLayoutModule {}
