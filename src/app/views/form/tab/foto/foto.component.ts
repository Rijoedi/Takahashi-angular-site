import { Component, OnInit, ViewChild, Input } from "@angular/core";

import { Router } from "@angular/router";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { StepUtil } from "../../../../util/step-util.service";
import { Cliente } from "../../../../model/cliente";
import { DataService } from "../../../../services/data.service";
import { ClienteService } from "../../../../services/clienteService.service";
import { WebcamUtil, WebcamInitError, WebcamImage } from "ngx-webcam";
import { Subject, Observable } from "rxjs";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-foto",
  templateUrl: "./foto.component.html",
})
export class FotoComponent implements OnInit {
  @Input() stepUtil: StepUtil;

  @ViewChild("confirmModal") public confirmModal: ModalDirective;

  cliente: Cliente;
  fileToUpload: File = null;

  // loading
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  //camera Options
  linkPicture: any;
  timeStamp: number;
  hasCamera = true;

  //Modal
  title: string;
  body: string;

  constructor(
    private router: Router,
    private dataService: DataService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.cliente = this.dataService.getCliente();
    this.setLinkPicture();
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        if(mediaDevices.length == 0){
          this.hasCamera = false;
        }
      }
    );
  }

  public setLinkPicture() {
    if (this.cliente.caminhoFoto != null) {
      let url =
        "https://files.takahashigroupjapan.com/" + this.cliente.caminhoFoto;
      this.linkPicture = url;
      this.timeStamp = new Date().getTime();
    }
    this.updateLinkPicture();
  }

  updateLinkPicture() {
    if (this.timeStamp) {
      this.linkPicture = this.linkPicture + "?" + this.timeStamp;
    }
  }

  uploadImage64(image) {
    this.uploadFile(true, image);
    this.webcamImage = null;
  }

  previewFromFile(files: FileList) {
    //check if file a image
    if (files[0]) {
      const file: File = files[0];
      var pattern = /image-*/;
      if (!file.type.match(pattern)) {
        this.erroImagem();
        return;
      }
      this.fileToUpload = files.item(0);
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.linkPicture = reader.result;
      };
    }
  }

  uploadExistingFile() {
    this.uploadFile(false, this.fileToUpload);
    this.fileToUpload = null;
  }

  uploadFile(isCamera: boolean, image: any) {
    if (isCamera) {
      this.clienteService.sendPhotoBase64(image, this.cliente.id).subscribe(
        (cliente) => {
          this.cliente = cliente;
          this.setLinkPicture();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.clienteService.sendFile(image, this.cliente.id).subscribe(
        (cliente) => {
          this.cliente = cliente;
          this.setLinkPicture();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  erroImagem() {
    this.title = "Erro";
    this.body = "Por favor selecione uma imagem !";
    this.confirmModal.show();
  }

  openConfirmModal() {
    if (this.cliente.caminhoFoto != null) {
      this.title = "Cadastro salvo com sucesso!";
      this.body = "Obrigado por se cadastrar na Takahashi assessoria !";
      this.confirmModal.show();
    } else {
      this.title = "Erro";
      this.body = "por favor insira uma foto para completar seu cadastro";
      this.confirmModal.show();
    }
  }

  //Ngx webcam implementation
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public facingMode: string = "environment";
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public showWebcamBtn() {
    this.webcamImage = undefined;
    this.showWebcam = true;
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === "NotAllowedError"
    ) {
      console.warn("Camera access was not allowed by user!");
    }
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== "") {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }
}
