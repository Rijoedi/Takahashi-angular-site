import { Component, OnInit, Input } from '@angular/core';

import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { StepUtil } from '../../../../util/step-util.service';
import { Cliente } from '../../../../model/cliente';
import { DataService } from '../../../../services/data.service';
import { ClienteService } from '../../../../services/clienteService.service';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html'
})
export class QuestionarioComponent implements OnInit {

  @Input() stepUtil: StepUtil;
  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  cliente: Cliente;

  constructor(
    private dataService: DataService,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.cliente = this.dataService.getCliente();
  }


  proximo() {
    this.loading = true;
    this.clienteService.addCliente(this.cliente)
    .subscribe(cliente => {
      this.loading = false;
      this.dataService.setCliente(cliente);
      this.stepUtil.proximoPasso();
    }, err =>{
        this.loading = false;
    });
  }

  // RADIO-BUTTON
  public listOfOptions = [{ "name": "Sim", "value": true},
  { "name": "Não",  "value": false }];

  public tempoJapaoOption = [{ "name": "Indeterminado", "value": true},
  { "name": "1 a 5 anos",  "value": false }];

  public detroCanhotoOp = [{ "name": "Destro", "value": true},
  { "name": "Canhoto",  "value": false }];
}
