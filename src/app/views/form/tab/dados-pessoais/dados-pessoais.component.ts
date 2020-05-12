import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from "ngx-intl-tel-input";
import { Cliente } from "../../../../model/cliente";
import { DataService } from "../../../../services/data.service";
import { ClienteService } from "../../../../services/clienteService.service";
import { GenericValidator } from "../../../../util/GenericValidator";
import { TipoCarteiraHabilitacao } from "../../../../model/tipoCarteiraHabilitacao";
import { StepUtil } from "../../../../util/step-util.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-dados-pessoais",
  templateUrl: "./dados-pessoais.component.html",
})
export class DadosPessoaisComponent implements OnInit, AfterViewInit {
  // Model
  cliente: Cliente;

  //Modal
  @ViewChild("languageModal") public languageModal: ModalDirective;
  @ViewChild("dangerModal") public dangerModal: ModalDirective;

  //telefone
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  telefone: any;
  selectedCountryISO: CountryISO;

  //Date
  minDate: Date;
  maxDate: Date;
  maxDateVisto: Date;
  minDateVisto: Date;

  //Modal
  title: string;
  body: string;
  buttonPrimary: string;
  buttonSecundary: string;

  //mask
  cep: any;
  cpf = [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  rg = [/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/];

  // validation
  dadosPessoaisForm: FormGroup;
  term = false;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  //Step util
  @Input() stepUtil = StepUtil;

  constructor(
    private dataService: DataService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.validaFormulario();
    this.cep = this.setCpfMask();
    if (this.dataService.getCliente() != undefined) {
      this.term = true;
      this.setRangeDate();
      this.setLocalTel();
      this.cliente = this.dataService.getCliente();
      this.telefone = this.cliente.telefone;
      this.getCnhFromCliente();
    } else {
      this.cliente = new Cliente();
    }
  }

  ngAfterViewInit() {
    if (this.dataService.getLocalidade() == undefined) {
      this.setLanguageModal(
        "Takahashi Assessoria",
        "Por favor escolha a localidade que você mora."
      );
    }
  }

  localidade(localidade: number) {
    this.dataService.setLocalidade(localidade);
    this.setLocalTel();
    this.cep = this.setCpfMask();
    this.languageModal.hide();
  }

  setCpfMask() {
    if (this.isJapan()) {
      return [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
    } else {
      return [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
    }
  }

  setRangeDate() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 120, 0, 1);
    this.maxDate = new Date(currentYear + 0, 11, 31);
    this.minDateVisto = new Date(currentYear + 0, 1, 1);
    this.maxDateVisto = new Date(currentYear + 5, 11, 31);
  }

  setLocalTel() {
    if (this.dataService.getLocalidade() == 1) {
      this.selectedCountryISO = CountryISO.Brazil;
    } else {
      this.selectedCountryISO = CountryISO.Japan;
    }
  }

  checkNumber() {
    if (this.telefone != null) {
      this.cliente.telefone = this.telefone.internationalNumber;
    }
  }

  validaFormulario() {
    this.dadosPessoaisForm = this.formBuilder.group({
      nomeCompleto: [null, [Validators.required, Validators.minLength(3)]],
      eMail: [null, [Validators.required, Validators.email]],
      cep: [null, [Validators.pattern("[0-9]*-[0-9]*")]],
      altura: [null, [Validators.pattern("^[0-9]{1,3}$")]],
      manequin: [null, [Validators.maxLength(3)]],
      peso: [null, [Validators.pattern("^[0-9]{0,3}$")]],
      calcado: [null, [Validators.pattern("^[0-9]{0,2}$")]],
      conversacao: [null, [Validators.pattern("^[0-9]{0,3}$")]],
      compreensao: [null, [Validators.pattern("^[0-9]{0,3}$")]],
      leitura: [null, [Validators.pattern("^[0-9]{0,3}$")]],
      escrita: [null, [Validators.pattern("^[0-9]{0,3}$")]],
      cpfZairyuCard: this.validaCpfOrZairyuCard(),
      telefone: this.validaTelefone(),
    });
  }

  validaTelefone() {
    if (this.isJapan()) {
      return [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ];
    } else {
      return [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ];
    }
  }

  validaCpfOrZairyuCard() {
    if (this.isJapan()) {
      return [null, [Validators.required]];
    } else {
      return [
        null,
        [
          Validators.required,
          Validators.minLength(11),
          GenericValidator.isValidCpf(),
        ],
      ];
    }
  }

  onSubmit() {
    if (this.dadosPessoaisForm.valid && this.term == true) {
      let telefone = this.cliente.telefone.replace(/[^a-zA-Z0-9]/g, "");
      this.cliente.telefone = telefone;
      this.addCLiente();
    } else if (this.term == false) {
      this.setModal(
        "Erro",
        "Por favor aceite o termo de concordância para continuar."
      );
    } else {
      this.setModal(
        "Erro",
        "Por favor verifique se existe algum campo mal preenchido ou se faltou preencher algum campo obrigatório."
      );
    }
  }

  setLanguageModal(title: string, message: string) {
    this.title = title;
    this.body = message;
    this.buttonPrimary = "Brasil";
    this.buttonSecundary = "Japão";
    this.languageModal.show();
  }

  setModal(title: string, message: string) {
    this.title = title;
    this.body = message;
    this.buttonPrimary = "OK";
    this.dangerModal.show();
  }

  // async messageEmail() {
  //   const alert = await this.alertController.create({
  //     header: "Cadastro em andamento!",
  //     subHeader: "informações de login",
  //     message:
  //       "Por favor verifique seu e-mail (" +
  //       this.cliente.email.toLowerCase() +
  //       ") para obter as informações de login.",
  //     buttons: ["OK"],
  //   });
  //   await alert.present();
  // }

  addCLiente() {
    this.loading = true;
    this.cliente.localidade = this.dataService.getLocalidade();
    this.clienteService.addCliente(this.cliente).subscribe(
      (data) => {
        if (data != null) {
          this.loading = false;
          this.dataService.setCliente(data);
          this.stepUtil.proximoPasso();
        } else {
          this.loading = false;
          this.setModal(
            "Erro",
            "Erro ao se cadastrar, por favor entre em contato com o administrador ou tente novamente."
          );
        }
      },
      (err) => {
        this.loading = false;
        this.setModal(
          "Erro",
          "Erro ao se cadastrar, por favor entre em contato com o administrador ou tente novamente."
        );
      }
    );
  }

  listChange(item) {
    if (item.isChecked === true) {
      this.cliente.tipoCarteiraHabilitacaoList.push(
        new TipoCarteiraHabilitacao(item.value, item.name)
      );
    } else {
      let index = this.cliente.tipoCarteiraHabilitacaoList.findIndex((cnh) => {
        return cnh.id == item.value;
      });
      if (index > -1) {
        this.cliente.tipoCarteiraHabilitacaoList.splice(index, 1);
      }
    }
  }

  isJapan(): boolean {
    return this.dataService.getLocalidade() == 2;
  }

  // CNH
  getCnhFromCliente() {
    let cnhList = this.cliente.tipoCarteiraHabilitacaoList;
    for (let cnh of cnhList) {
      this.checkboxList.forEach((c) => {
        if (c.value === cnh.id) {
          c.isChecked = true;
        }
      });
    }
  }

  // SELECTS
  public checkboxList = [
    { name: "Não possui", value: 1, isChecked: false },
    { name: "A", value: 2, isChecked: false },
    { name: "B", value: 3, isChecked: false },
    { name: "C", value: 4, isChecked: false },
    { name: "D", value: 5, isChecked: false },
    { name: "E", value: 6, isChecked: false },
    { name: "AB", value: 7, isChecked: false },
  ];

  public visto = [
    { name: "Em andamento", value: 1 },
    { name: "定住者 (Long term resident)", value: 2 },
    { name: "永住者 (Permanent)", value: 3 },
  ];

  public sexo = [
    { name: "Masculino", value: 1 },
    { name: "Feminino", value: 2 },
  ];

  public estadoCivil = [
    { name: "SOLTEIRO(A)", value: 1 },
    { name: "CASADO(A)", value: 2 },
    { name: "DIVORCIADO(A)", value: 3 },
    { name: "VIÚVO(A)", value: 4 },
  ];

  public sangue = [
    { name: "Não sabe", value: 1 },
    { name: "A+", value: 2 },
    { name: "A-", value: 3 },
    { name: "B+", value: 4 },
    { name: "B-", value: 5 },
    { name: "AB+", value: 6 },
    { name: "AB-", value: 7 },
    { name: "O+", value: 8 },
    { name: "O-", value: 9 },
  ];

  public escolaridade = [
    { name: "Ensino fundamental incompleto", value: 1 },
    { name: "Ensino fundamental completo", value: 2 },
    { name: "Ensino médio incompleto", value: 3 },
    { name: "Ensino médio completo", value: 4 },
    { name: "Ensino superior incompleto", value: 5 },
    { name: "Ensino superior completo", value: 6 },
  ];
}
