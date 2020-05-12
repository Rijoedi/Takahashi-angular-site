import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';

// Component routing
import { LoginRoutingModule } from "./login-routing.module";

// Component
import { LoginComponent } from "./login.component";
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({})
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
