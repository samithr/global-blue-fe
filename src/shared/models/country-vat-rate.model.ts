export interface CountryVatRateModel {
    isError: boolean
    statusCode: number
    result: VatRate[]
    message: string
  }
  
  export interface VatRate {
    country: string
    vatRates: number[]
  }
  