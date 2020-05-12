import { Component, OnInit } from "@angular/core";
import { StepUtil } from '../../util/step-util.service';
import { DataService } from '../../services/data.service';

@Component({
  templateUrl: "register.component.html",
})
export class RegisterComponent implements OnInit {
  
  constructor(
    private dataService: DataService,
  ) {}

  public stepUtil = new StepUtil();

  ngOnInit() {
    if (this.dataService.getCliente() != undefined) {
      this.setAba();
    }
  }

  setAba() {
    if (this.isJapan()) {
      this.setPassosFrom(2);
      this.setPassosFrom(4);
      this.setPassosFrom(0);
    } else {
      this.setPassosFrom(2);
      this.setPassosFrom(3);
      this.setPassosFrom(4);
      this.setPassosFrom(0);
    }
  }

  setPassosFrom(passo: number) {
    this.stepUtil.setPassoCadastro(passo);
    this.stepUtil.verificarUltimoPasso();
  }

  onClick(step: string) {
    switch (step) {
      case "dados": {
        this.setPassos(0);
        break;
      }
      case "familia": {
        this.setPassos(1);
        break;
      }
      case "empregos": {
        this.setPassos(2);
        break;
      }
      case "questionario": {
        this.setPassos(3);
        break;
      }
      case "arquivos": {
        this.setPassos(4);
        break;
      }
    }
  }

  setPassos(passo: number){
    if(this.stepUtil.getUltimoPasso() >= passo){
      this.stepUtil.setPassoCadastro(passo);
    }
  }

  isJapan(): boolean {
    return this.dataService.getLocalidade() == 2;
  }
}
