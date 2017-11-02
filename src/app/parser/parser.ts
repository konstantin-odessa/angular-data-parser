import { Response } from '@angular/http';
import * as xml2js from 'xml2js';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishLast';

import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
@Injectable()
export class Parser {
    private subj: ReplaySubject<any> = new ReplaySubject();
    asyncData: any = this.subj.asObservable();

    private parsedFormatsList: { format: string, parsed: boolean }[];

    parseByFormats(formatsList: string[], data: any): void {
        this.parsedFormatsList = formatsList
            .filter(parseFormatFunc => this[parseFormatFunc])
            .map((format: string) => ({ format: format, parsed: false }));

        data.forEach((item, index) => {
            /* check if format parser function exists in Parser prototype */
            if (this[formatsList[index]]) {
                this[formatsList[index]](item);
            }
        });
    }
    protected emit(format: string, data: any): void {
        this.parsedFormatsList
            .find((item: { format: string, parsed: boolean }) => item.format === format)
            .parsed = true;
        this.subj.next({ format: format, data: data });

        if (this.parsedFormatsList
                .every((item: { format: string, parsed: boolean }) => item.parsed)) {
            this.subj.complete();
        }
    }

    /* parse functions; to add more parsing functions you can extend Parser class and implement additional parse logic */
    private json(response: Response) {
        const data = response.json();
        this.emit('json', data);
    }
    private xml(response: Response) {
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
}
