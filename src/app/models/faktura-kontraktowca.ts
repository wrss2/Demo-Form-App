export interface formElement {
  id:number;
  stawkaVAT: number;
  kwotaNetto: number;
  kwotaVAT: number;
  kwotaBrutto: number;
  removeRowButton:string;
}

export interface stawkaVAT {
  value: number | string;
  viewValue: string;
}

export interface responseAPI{
  dataDostawy: string;
  dataWystawienia: string;
  terminPlatnosci: string;
  kwotaBruttoSuma?: number;
  kwotaNettoSuma?: number;
  kwotaVATSuma?: number;
  nip?: number;
  waluta?: string;
  podatekWyliczeniaLista?: podatekWyliczeniaLista[];
}

export interface podatekWyliczeniaLista {
  kwotaNetto:number;
  kwotaBrutto:number;
  kwotaVAT:number;
  stawkaVAT:number;
}

enum kwotaType  {
  kwotaNetto,
  kwotaVAT,
  kwotaBrutto,
}
