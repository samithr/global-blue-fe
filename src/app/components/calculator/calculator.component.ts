import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { REGEX } from 'src/shared/assests/REGEX';
import { CountryService } from 'src/shared/services/country.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public calculatorForm: FormGroup;
  public countryVatData: any;
  public countryArray: string[];
  public vatData: number[];
  public selectedCountry: string;
  public selectedVATRate: number;

  public pWVSelected: boolean;
  public vATSelected: boolean;
  public pITSelected: boolean;
  public valuePWT: number;
  public valuePIT: number;
  public valueVAT: number;

  constructor(private countryService: CountryService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.calculatorForm = this.formBuilder.group({
      country: new FormControl('', [Validators.required]),
      vatRates: new FormControl(),
      priceWithoutVAT: new FormControl({value: '', disabled: this.pWVSelected}, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
      valueAddedTax: new FormControl({value: '', disabled: this.vATSelected}, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
      priceIncludedVAT: new FormControl({value: '', disabled: this.pITSelected}, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
    })
    this.getVATRates();
  }

  getVATRates() {
    this.countryService.getVatRates()
      .subscribe(data => {
        if (data !== null)
        this.countryVatData = data.result;
        this.countryArray = data.result.map(o => o.country);
      })
  }

  onCountrySelect() {
    if (this.selectedCountry != undefined) {
      this.vatData = this.getCountryVatData(this.selectedCountry);
      console.log("vatData", this.vatData);
    }
  }

  getCountryVatData(country: string) {
    console.log("Country", country);
    return this.countryVatData.find((o: { country: string; }) => o.country === country).vatRates;
  }

  selectPWT(event: MatCheckboxChange): void {
    this.pWVSelected = event.checked;
    this.vATSelected = false;
    this.pITSelected = false;
    this.calculatorForm.controls['priceWithoutVAT'].enable();
    this.calculatorForm.controls['valueAddedTax'].disable();
    this.calculatorForm.controls['priceIncludedVAT'].disable();
    console.log("pITSelected",this.pITSelected);
  }
  processPriceWithoutVAT() {

  }

  selectVAT(event: MatCheckboxChange): void {
    this.vATSelected = event.checked;
    this.pWVSelected = false;
    this.pITSelected = false;
    this.calculatorForm.controls['valueAddedTax'].enable();
    this.calculatorForm.controls['priceWithoutVAT'].disable();
    this.calculatorForm.controls['priceIncludedVAT'].disable();
  }
  processVAT() {

  }

  selectPIT(event: MatCheckboxChange): void {
    this.pITSelected = event.checked;
    this.pWVSelected = false;
    this.vATSelected = false;
    this.calculatorForm.controls['priceIncludedVAT'].enable();
    this.calculatorForm.controls['priceWithoutVAT'].disable();
    this.calculatorForm.controls['valueAddedTax'].disable();
    console.log("pITSelected",this.pITSelected);
  }
  processPriceIncludeVAT() {
    console.log(this.valuePIT)
  }
}
