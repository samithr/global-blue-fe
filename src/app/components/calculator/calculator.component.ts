import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { REGEX } from 'src/shared/assests/REGEX';
import { CountryService } from 'src/shared/services/country.service';
import { CalculationModel } from 'src/shared/models/calculation.model';
import { CheckBoxModel } from 'src/shared/models/checkbox.model';
import { MatRadioChange } from '@angular/material/radio';

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

  public checkBoxModel: CheckBoxModel = new CheckBoxModel();
  public calculationModel: CalculationModel = new CalculationModel();

  constructor(private countryService: CountryService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.calculatorForm = this.formBuilder.group({
      country: new FormControl('', [Validators.required]),
      vatRates: new FormControl(),
      priceWithoutVAT: new FormControl({ value: '', disabled: this.checkBoxModel.pWVSelected }, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
      valueAddedTax: new FormControl({ value: '', disabled: this.checkBoxModel.vATSelected }, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
      priceIncludedVAT: new FormControl({ value: '', disabled: this.checkBoxModel.pITSelected }, [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
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
    }
  }

  radioButtonChange(data: MatRadioChange) {
    if (data.value) {
      this.selectedVATRate = data.value;
      if (this.checkBoxModel.pWVSelected) {
        this.updateNett()
      }
      if (this.checkBoxModel.vATSelected) {
        this.updateVat()
      }
      if (this.checkBoxModel.pITSelected) {
        this.updateGross()
      }
    }
  }

  getCountryVatData(country: string) {
    return this.countryVatData.find((o: { country: string; }) => o.country === country).vatRates;
  }

  selectPWT(event: MatCheckboxChange): void {
    this.checkBoxModel.pWVSelected = event.checked;
    this.checkBoxModel.vATSelected = false;
    this.checkBoxModel.pITSelected = false;
    this.calculatorForm.controls['priceWithoutVAT'].enable();
    this.calculatorForm.controls['valueAddedTax'].disable();
    this.calculatorForm.controls['priceIncludedVAT'].disable();
  }

  selectVAT(event: MatCheckboxChange): void {
    this.checkBoxModel.vATSelected = event.checked;
    this.checkBoxModel.pWVSelected = false;
    this.checkBoxModel.pITSelected = false;
    this.calculatorForm.controls['valueAddedTax'].enable();
    this.calculatorForm.controls['priceWithoutVAT'].disable();
    this.calculatorForm.controls['priceIncludedVAT'].disable();
  }

  selectPIT(event: MatCheckboxChange): void {
    this.checkBoxModel.pITSelected = event.checked;
    this.checkBoxModel.pWVSelected = false;
    this.checkBoxModel.vATSelected = false;
    this.calculatorForm.controls['priceIncludedVAT'].enable();
    this.calculatorForm.controls['priceWithoutVAT'].disable();
    this.calculatorForm.controls['valueAddedTax'].disable();
  }

  updateNett() {
    if (this.calculationModel.nett && this.selectedVATRate) {
      let vatValue: number;
      vatValue = this.calculationModel.nett * this.selectedVATRate / 100;
      this.calculationModel.vat = vatValue
      this.calculationModel.gross = (+this.calculationModel.nett + this.calculationModel.vat);
    }
  }

  updateVat() {
    if (this.calculationModel.vat && this.selectedVATRate) {
      let nettValue: number;
      nettValue = 100 * this.calculationModel.vat / this.selectedVATRate
      this.calculationModel.nett = nettValue;
      this.calculationModel.gross = (+nettValue + this.calculationModel.vat);
    }
  }

  updateGross() {
    if (this.calculationModel.gross && this.selectedVATRate) {
      let nettValue: number;
      nettValue = 100 * this.calculationModel.gross / (100 + this.selectedVATRate)
      this.calculationModel.nett = nettValue;
      this.calculationModel.vat = (nettValue * this.selectedVATRate) / 100;
    }
  }
}

