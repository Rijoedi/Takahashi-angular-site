import { Component, OnInit, Input, ViewChild } from "@angular/core";

import { ngxLoadingAnimationTypes } from "ngx-loading";
import { StepUtil } from "../../../../util/step-util.service";
import { Cliente } from "../../../../model/cliente";
import { Emprego } from "../../../../model/emprego";
import { DataService } from "../../../../services/data.service";
import { EmpregoService } from "../../../../services/emprego.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: "app-empregos",
  templateUrl: "./empregos.component.html",
})
export class EmpregosComponent implements OnInit {

  @Input() stepUtil: StepUtil;

  @ViewChild("confirmModal") public confirmModal: ModalDirective;


  private cliente: Cliente;
  empregos: Emprego[];

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  //modal
  title: string;
  body: string;
  empregoId: any;

  constructor(
    private dataService: DataService,
    private empregoService: EmpregoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.cliente = this.getCliente();
    if (this.dataService.getEmprego() !== null) {
      this.empregos = this.dataService.getEmprego();
    } else {
      this.getEmpregos(this.cliente.id);
    }
    // adicionar emprego
    this.emprego.flUltimoEmprego = false;
    this.validaFormulario();
  }

  proximo() {
    if (this.dataService.getLocalidade() == 2) {
      this.stepUtil.setPassoCadastro(4);
      this.stepUtil.verificarUltimoPasso();
    } else {
      this.stepUtil.proximoPasso();
    }
  }

  delete(id) {
    this.loading = true;
    this.empregoService.deleteEmprego(this.empregoId).subscribe(
      () => {
        this.getEmpregos(this.cliente.id);
        this.empregoId = undefined;
      },
      (err) => {
        this.empregoId = undefined;
        console.log(err);
      }
    );
    this.confirmModal.hide();
  }

  getEmpregos(id: number) {
    this.empregoService.getEmpregos(id).subscribe(
      (res) => {
        this.empregos = res;
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCliente() {
    return this.dataService.getCliente();
  }

   // Modal
   @ViewChild('empregoModal') public empregoModal: ModalDirective;

  //adicionar emprego Modal
  emprego: Emprego = new Emprego();

  //validation
  empregoForm: FormGroup;

  validaFormulario() {
    this.empregoForm = this.formBuilder.group({
      localTrabalho: ["", [Validators.required, Validators.minLength(3)]],
      ocupacao: ["", Validators.required],
      tipoContrato: ["", Validators.required],
      pais: ["", Validators.required],
      mesInicial: ["", Validators.required],
      anoInicial: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      mesFinal: ["", Validators.required],
      anoFinal: ["", [Validators.required, Validators.pattern("[0-9]*")]],
    });
  }

  dismiss(acao) {
    if (acao == "salvar" && this.empregoForm.valid) {
      this.addEmprego();
      this.empregoModal.hide();
    } else if (acao == "fechar") {
      this.empregoModal.hide();
    } else {
      // this.alertMessage();
    }
  }
  addEmprego() {
    this.loading = true;
    this.empregoService
      .addEmprego(this.emprego, this.cliente.id)
      .subscribe(
        () => {
          this.getEmpregos(this.cliente.id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //SELECT OPTIONS
  public meses = [
    { name: "Janeiro", value: "1" },
    { name: "Fevereiro", value: "2" },
    { name: "Março", value: "3" },
    { name: "Abril", value: "4" },
    { name: "Maio", value: "5" },
    { name: "Junho", value: "6" },
    { name: "Julho", value: "7" },
    { name: "Agosto", value: "8" },
    { name: "Setembro", value: "9" },
    { name: "Outubro", value: "10" },
    { name: "Novembro", value: "11" },
    { name: "Dezembro", value: "12" },
  ];

  public paises = [
    { name: "Brasil", value: "1" },
    { name: "Japão", value: "2" },
  ];

  public tipoContrato = [
    { name: "Tercerizado(Empreiteira)", value: "1" },
    { name: "Direto(Empresa)", value: "2" },
  ];

  open_modal_adicionar() {
    this.emprego = new Emprego();
    this.empregoModal.show();
  }

  messageDelete(id) {
    this.title = "Confirmação";
    this.body = "Realmente deseja excluir esse familiar ?";
    this.empregoId = id;
    this.confirmModal.show();
  }

}
