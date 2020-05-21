import { Component, OnInit, ViewChild } from "@angular/core";
import { Cliente } from "../../model/cliente";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClienteService } from "../../services/clienteService.service";
import { EmpregoService } from "../../services/emprego.service";
import { FamiliarService } from "../../services/familiarService.service";
import { DataService } from "../../services/data.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { CountryISO, TooltipLabel } from "ngx-intl-tel-input";
import { ThrowStmt } from "@angular/compiler";

@Component({
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  animate = true;
  cliente: Cliente = new Cliente();

  // form control para realizar as validacoes
  public loginForm: FormGroup;
  isEmail: Boolean;
  telefone: any;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;

  //modal
  title: string;
  body: string;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  // Modal
  @ViewChild("dangerModal") public dangerModal: ModalDirective;
  @ViewChild("confirmModal") public confirmModal: ModalDirective;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private empregoService: EmpregoService,
    private familiarService: FamiliarService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.validaFormulario();
  }

  validaFormulario() {
    this.loginForm = this.formBuilder.group({
      eMail: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  checkNumber() {
    if (this.telefone != null) {
      let tel = this.telefone.internationalNumber;
      this.cliente.telefone = tel.replace(/[^a-zA-Z0-9]/g, "");
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.loginForm.valid) {
      this.clienteService.getClienteByEmailAndPass(this.cliente).subscribe(
        (clienteSelected) => {
          if (clienteSelected != null) {
            this.cliente = clienteSelected;
            this.dataService.setCliente(this.cliente);
            this.dataService.setLocalidade(this.cliente.localidade);
            this.setEmpregos(this.cliente.id);
            this.setFamiliares(this.cliente.id);
            this.loading = false;
            this.router.navigateByUrl("/register");
          } else {
            this.loading = false;
            this.openDangerModal(
              "E-mail ou senha inválido",
              "Não foi encontrado nenhum cliente com o e-mail/senha fornecido."
            );
          }
        },
        (err) => {
          this.loading = false;
          console.log("Erro ao logar " + err);
        }
      );
    }
  }

  recoverPassword() {
    this.loading = true;
    if (this.isEmail) {
      this.cliente.telefone = undefined;
    } else {
      this.cliente.email = undefined;
    }
    this.clienteService.recoverPass(this.cliente).subscribe(
      (resp) => {
        if (this.dataService.getStatus() == 200) {
          this.loading = false;
          if (this.isEmail) {
            this.openConfirmModal(
              "Atenção!",
              "Foi enviado um link para resetar sua senha no email " +
                this.cliente.email +
                ""
            );
          } else {
            this.openConfirmModal(
              "Atenção",
              "Foi enviado um link para resetar sua senha no número " +
                this.cliente.telefone +
                ""
            );
          }
        } else {
          this.loading = false;
          if (this.isEmail) {
            this.openDangerModal(
              "Erro",
              "Não foi encontrado nenhum cliente com o e-mail e data de nascimento fornecido."
            );
          } else {
            this.openDangerModal(
              "Erro",
              "Não foi encontrado nenhum cliente com o telefone e data de nascimento fornecido."
            );
          }
        }
      },
      (err) => {
        this.loading = false;
        console.log("Erro ao logar " + err);
      }
    );
  }

  openConfirmModal(title: string, body: string) {
    this.title = title;
    this.body = body;
    this.confirmModal.show();
  }

  openDangerModal(title: string, body: string) {
    this.title = title;
    this.body = body;
    this.dangerModal.show();
  }

  formClient() {
    this.dataService.resetDataService();
    this.router.navigate(["/register"]);
  }

  setEmpregos(id: number) {
    this.empregoService.getEmpregos(id).subscribe(
      (res) => {
        this.dataService.setEmprego(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setFamiliares(id: number) {
    this.familiarService.getFamiliares(id).subscribe(
      (res) => {
        this.dataService.setFamiliares(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
