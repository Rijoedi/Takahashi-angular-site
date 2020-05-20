import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ClienteService } from "../../services/clienteService.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { DataService } from "../../services/data.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";

@Component({
  selector: "app-recover-password",
  templateUrl: "./recover-password.component.html",
})
export class RecoverPasswordComponent implements OnInit, AfterViewInit {
  //param from url
  tokenParam: string;

  //password
  password: string;
  confirmPassword: string;

  //modal
  title: string;
  body: string;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  // form
  public recoverPassForm: FormGroup;

  @ViewChild("confirmModal") public confirmModal: ModalDirective;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    activatedRoute.queryParams.subscribe(
      (data) => (this.tokenParam = data["token"])
    );
  }
  ngAfterViewInit() {
    if (this.tokenParam == undefined) {
      this.router.navigateByUrl("/404");
    }
  }

  ngOnInit() {
    this.validaFormulario();
  }

  validaFormulario() {
    this.recoverPassForm = this.formBuilder.group(
      {
        password: ["", [Validators.minLength(6), Validators.maxLength(8)]],
        confirmPassword: [""],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    let password = group.get("password").value;
    let confirmPassword = group.get("confirmPassword").value;
    return password === confirmPassword ? null : { notSame: true };
  }

  submit() {
    this.loading = true;
    let dados = {
      password: this.password,
      confirmPassword: this.confirmPassword,
      token: this.tokenParam,
    };
    this.clienteService.sendNewPass(dados).subscribe((resp) => {
      if (this.dataService.getStatus() == 200) {
        this.loading = false;
        this.openConfirmModal("Sucesso!", "Senha alterada com sucesso");
      } else {
        this.loading = false;
        this.openConfirmModal("Ops!", "Algo deu errado, entre em contato com o administrador.");
      }
    });
  }

  goToLogin(){
    this.router.navigateByUrl("/login");
  }

  openConfirmModal(titulo: string, corpo: string) {
    this.title = titulo;
    this.body = corpo;
    this.confirmModal.show();
  }
}
