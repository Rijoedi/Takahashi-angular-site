import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';

// Component routing
import { LoginRoutingModule } from "./login-routing.module";

// Component
import { LoginComponent } from "./login.component";
import { NgxLoadingModule } from 'ngx-loading';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; 

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
