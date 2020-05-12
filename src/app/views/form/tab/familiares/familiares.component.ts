import { Component, OnInit, Input, ViewChild } from "@angular/core";

import { ngxLoadingAnimationTypes } from "ngx-loading";
import { StepUtil } from "../../../../util/step-util.service";
import { Cliente } from "../../../../model/cliente";
import { Familiar } from "../../../../model/familiar";
import { DataService } from "../../../../services/data.service";
import { FamiliarService } from "../../../../services/familiarService.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-familiares",
  templateUrl: "./familiares.component.html",
})
export class FamiliaresComponent implements OnInit {
  @Input() stepUtil: StepUtil;

  @ViewChild("confirmModal") public confirmModal: ModalDirective;

  cliente: Cliente;
  familiares: Familiar[];
  familiar: Familiar = new Familiar();

  //modal property
  title: string;
  body: string;
  familiarId: number;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(
    private dataService: DataService,
    private familiarService: FamiliarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.cliente = this.getCliente();
    if (this.dataService.getFamiliares() !== null) {
      this.familiares = this.dataService.getFamiliares();
    } else {
      this.getFamiliares(this.cliente.id);
    }
    this.validaFormulario();
  }

  getFamiliares(id) {
    this.familiarService.getFamiliares(id).subscribe(
      (res) => {
        this.familiares = res;
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

  delete() {
    this.loading = true;
    this.familiarService.deleteFamiliar(this.familiarId).subscribe(
      () => {
        this.getFamiliares(this.cliente.id);
        this.familiarId = undefined;
      },
      (err) => {
        this.familiarId = undefined;
        console.log(err);
      }
    );
    this.confirmModal.hide();
  }

  messageDelete(id) {
    this.title = "Confirmação";
    this.body = "Realmente deseja excluir esse familiar ?";
    this.familiarId = id;
    this.confirmModal.show();
  }

  open_modal_adicionar() {
    this.familiar = new Familiar();
    this.familiarModal.show();
  }

  //Modal adicionar Familia
  @ViewChild("familiarModal") public familiarModal: ModalDirective;
  //validation
  familiarForm: FormGroup;

  validaFormulario() {
    this.familiarForm = this.formBuilder.group({
      nomeCompleto: ["", [Validators.required, Validators.minLength(3)]],
      parentesco: ["", [Validators.required]],
      idade: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      residencia: ["", Validators.required],
      telefone: ["", [Validators.pattern("[0-9]*")]],
    });
  }

  dismiss(acao) {
    if (acao == "salvar" && this.familiarForm.valid) {
      this.addFamiliar();
      this.familiarModal.hide();
    } else if (acao == "fechar") {
      this.familiarModal.hide();
    } else {
    }
  }

  addFamiliar() {
    this.loading = true;
    this.familiarService
      .addFamiliar(this.familiar, this.cliente.id)
      .subscribe(
        () => {
          this.getFamiliares(this.cliente.id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //SELECT OPTIONS
  public lugares = [
    { name: "Japão", value: 1 },
    { name: "Brasil", value: 2 },
  ];
  public parentes = [
    { name: "Pai", value: 1 },
    { name: "Mãe", value: 2 },
    { name: "Esposo (a)", value: 3 },
    { name: "Filho", value: 4 },
    { name: "Filha", value: 5 },
    { name: "Outros", value: 6 },
  ];
}
