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
  public pWTSelected:boolean;
  public vATSelected:boolean;
  public pITSelected:boolean;

  constructor(private countryService: CountryService,
              private formBuilder: FormBuilder) {    }

    ngOnInit(): void {
      this.calculatorForm = this.formBuilder.group({
          country: new FormControl('', [Validators.required]),
          vatRates:new FormControl(),
          priceWithoutVAT: new FormControl('', [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
          valueAddedTax:new FormControl('', [Validators.required, Validators.pattern(REGEX.NUMERIC_NUMBERS)]),
          priceIncludedVAT:new FormControl(),
        })
        this.getVATRates();
      }

      getVATRates(){
        this.countryService.getVatRates()
        .subscribe(data => {
          if(data !== null)
          this.countryVatData = data.result.find(o=> o.country);
          this.countryArray = data.result.map(o=> o.country);
        })
      }

      // getCountryVatData(country:string){
      //   return countryVatData.map(o=> o.country === country)
      // }

      updateAllComplete(){

      }

      selectPWT(event:MatCheckboxChange): void {
        this.pWTSelected = event.checked;
        
        this.vATSelected = false;
        this.pITSelected = false;
        console.log(this.pWTSelected);
    }

      selectVAT(event:MatCheckboxChange): void {
        this.vATSelected = event.checked;

        this.pWTSelected = false;
        this.pITSelected = false;
        console.log(this.vATSelected);
    }

      selectPIT(event:MatCheckboxChange): void {
        this.pITSelected = event.checked;
        
        this.pWTSelected = false;
        this.vATSelected = false;
        console.log(this.pITSelected);
    }
}
