import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { CountryVatRateModel } from "../models/country-vat-rate.model";

@Injectable()
export class CountryService {
    private serverUrl = environment.baseUrl;
    private controllerUrl = environment.controllerCountry;
    private methodUrl = environment.methodGetVatRates;

    /**
     * Constructor
     */
    constructor(private http: HttpClient) {}

    /**
     * Get all country vat rates
     */
    public getVatRates(): Observable<CountryVatRateModel>{
        let endPoint = this.serverUrl + this.controllerUrl + this.methodUrl;
        return this.http.get<CountryVatRateModel> (endPoint);
    }
}