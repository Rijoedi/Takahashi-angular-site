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

@Component({
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  animate = true;
  cliente: Cliente = new Cliente();

  // form control para realizar as validacoes
  public loginForm: FormGroup;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  // Modal
  @ViewChild("dangerModal") public dangerModal: ModalDirective;

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
            this.dangerModal.show();
          }
        },
        (err) => {
          this.loading = false;
          console.log("Erro ao logar " + err);
        }
      );
    }
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
