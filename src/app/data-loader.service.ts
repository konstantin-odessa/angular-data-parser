import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ParserAggregator } from './parser/parser-aggregator';
import { FormatType } from './parser/format-parser';

@Injectable()
export class DataLoaderService {
    constructor(private http: Http, private parser: ParserAggregator) {}

    getData(formatsList: FormatType[]): any {
        return Observable.zip(...formatsList.map(this.parseRequest), (...data) => {
            this.parser.parseByFormats(formatsList, data);
            return this.parser.asyncData;
        });
    }

    private parseRequest = (format: FormatType): Observable<any> => {
        // const baseUrl = 'http://localhost:4200/';
        const baseUrl = '';
        const headers: Headers = new Headers({'Content-Type': 'application/json'});
        const options: RequestOptions = new RequestOptions({ headers: headers });
        const url = `${baseUrl}assets/server-data/data.${format}`;
        console.log(url);
        return this.http.get(url, options)
            .catch(this.handleError);
    }
    private handleError(error: Response | any) {
        const errMsg: string = error.toString();
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
