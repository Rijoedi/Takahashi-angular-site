import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';

// Component routing
import { RecoverPasswordRoutingModule } from "./recover-password-routing.module";

// Component
import { NgxLoadingModule } from 'ngx-loading';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; 
import { RecoverPasswordComponent } from './recover-password.component';

@NgModule({
  imports: [
    CommonModule,
    RecoverPasswordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [RecoverPasswordComponent],
})
export class RecoverPasswordModule {}
