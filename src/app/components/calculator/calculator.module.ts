import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { CountryService } from 'src/shared/services/country.service';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  providers:[
    CountryService
  ]
})
export class CalculatorModule { }
