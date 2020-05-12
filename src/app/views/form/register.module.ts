// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components Routing
import { RegisterRoutingModule } from './register-routing.module';
import {WebcamModule} from 'ngx-webcam';

// Components
import { RegisterComponent } from './register.component';
import { DadosPessoaisComponent } from "./tab/dados-pessoais/dados-pessoais.component";
import { EmpregosComponent } from './tab/empregos/empregos.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; 
import { TextMaskModule } from 'angular2-text-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FamiliaresComponent } from './tab/familiares/familiares.component';
import { QuestionarioComponent } from './tab/questionario/questionario.component';
import { FotoComponent } from './tab/foto/foto.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    CollapseModule.forRoot(),
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
    TextMaskModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    WebcamModule
  ],
  declarations: [
    RegisterComponent,
    DadosPessoaisComponent,
    FamiliaresComponent,
    EmpregosComponent,
    QuestionarioComponent,
    FotoComponent,
  ],
})
export class RegisterModule { }