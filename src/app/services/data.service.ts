import { Injectable } from '@angular/core';
import { Cliente } from '../model/cliente';
import { Emprego } from '../model/emprego';
import { Familiar } from '../model/familiar';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private cliente: Cliente;
    private emprego: Emprego[];
    private familiar: Familiar[];
    private localidade: number;

    constructor() { }

    resetDataService() {
        this.cliente = undefined;
        this.emprego = undefined; 
        this.familiar = undefined;
    }

    setCliente(cliente: Cliente) {
        this.cliente = cliente;
        this.setStringDateToDate(this.cliente);
    }
    getCliente() {
        return this.cliente;
    }
    setEmprego(emprego: Array<Emprego>) {
        this.emprego = emprego;
    }
    getEmprego() {
        return this.emprego;
    }
    setFamiliares(familiar: Array<Familiar>) {
        this.familiar = familiar;
    }
    getFamiliares() {
        return this.familiar;
    }

    setLocalidade(localidade: number) {
        this.localidade = localidade;
    }

    getLocalidade() {
        return this.localidade;
    }

    private setStringDateToDate(cliente){
        if(cliente.dataNascimento != null){
        this.cliente.dataNascimento = new Date(cliente.dataNascimento);
        }
        if(cliente.vencimentoVisto != null){
        this.cliente.vencimentoVisto = new Date(cliente.vencimentoVisto);
        }
    }
}
