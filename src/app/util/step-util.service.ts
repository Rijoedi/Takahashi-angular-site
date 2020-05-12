import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepUtil {

  private passoCadastro = 0;
  public ultimoPasso = 0;
  static proximoPasso: any;

  constructor() { }


  getPassoCadastro(): number {
    return this.passoCadastro;
  }
  getUltimoPasso(): number {
    return this.ultimoPasso;
  }
  setPassoCadastro(passo: number) {
    this.passoCadastro = passo;
  }
  proximoPasso() {
    this.passoCadastro++;
    this.verificarUltimoPasso();
  }
  Passoanterior() {
    if (this.passoCadastro > 0) {
      this.passoCadastro--;
    }
  }
  verificarUltimoPasso() {
    if (this.ultimoPasso < this.passoCadastro) {
      this.ultimoPasso = this.passoCadastro;
    }
  }

}
