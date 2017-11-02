import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Parser } from './parser/parser';

@Injectable()
export class DataLoaderService {
    constructor(private http: Http) {}

    getData(formatsList: string[], cb: Function): any {
        return Observable.zip(...formatsList.map(this.parseRequest), function(...data) {
            const t = new Parser(formatsList, data, cb);
            // t.asyncData.subscribe(items => {
            //     console.log(items);
            // });
            // t.parse(data);

            return t;
        });
    }

    private parseRequest = (format: string): Observable<any> => {
        // const baseUrl = 'http://localhost:4200/';
        const baseUrl = '';
        const headers: Headers = new Headers({'Content-Type': 'application/json'});
        const options: RequestOptions = new RequestOptions({ headers: headers });
        const url = `${baseUrl}assets/server-data/data.${format}`;
        console.log(url);
        return this.http.get(url, options)
            // .map(this.extractData)
            .catch(this.handleError);
    }
    private parseResponse(format: string) {

    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
