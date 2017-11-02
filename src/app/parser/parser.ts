import { Response } from '@angular/http';
import * as xml2js from 'xml2js';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishLast';

import { Subject } from 'rxjs/Subject';

export class Parser {
    private subj: Subject<any> = new Subject();
    asyncData: any = this.subj.asObservable().publishLast().refCount();
    // asyncData: any = this.subj.asObservable();

    data: any[];
    jsonFormatData: any;
    formatsList: string[];
    formatsMap: Map<string, boolean> = new Map();
    concData: any = [];
    cb: Function;

    constructor(formatsList: string[], data: any, cb: Function) {
        this.data = data;
        this.cb = cb;
        this.formatsList = formatsList;
        this.formatsList.forEach((format: string) => {
            this.formatsMap.set(format, false);
        });
    }

    parseByFormats(): void {
        this.data.forEach((item, index) => this[this.formatsList[index]](item));
        // return this.asyncData;
    }
    emit(format: string, data: any): void {
        if (format === 'json') {
            this.jsonFormatData = data;
        }
        this.cb(this.concData, data.users);
        this.subj.next(this.concData);
        this.formatsMap.set(format, true);
        const list = [];
        this.formatsMap.forEach((value: boolean, key: string) => {
            list.push(value);
        });
        const result = list.every(item => item);
        if (result) {
            this.subj.complete();
            // this.asyncData.connect();
        }
    }

    json(response: Response) {
        const data = response.json();

        this.emit('json', data);
    }
    xml(response: Response) {
        const self = this;
        xml2js.parseString( response.text(), function (err, result) {
            result.users = result.users.user.map(item => {
                return {
                    id: item.$.id,
                    firstName: item.firstName ? item.firstName[0] : '',
                    secondName: item.secondName ? item.secondName[0] : '',
                    email: item.email ? item.email[0] : '',
                    phoneNumber: item.phoneNumber ? item.phoneNumber[0] : '',
                };
            });
            self.emit('xml', result);
        });
    }
    csv() {}
}
