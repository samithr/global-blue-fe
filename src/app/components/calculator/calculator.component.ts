import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public countryArray: any;

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
          this.countryVatData = data.result;
          this.countryArray = data.result.find(o=> o.country);
        })
      }
}
