import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/publishLast';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { FormatParser, FormatType } from './format-parser';

@Injectable()
export class Parser {
    private subj: ReplaySubject<any> = new ReplaySubject();
    asyncData: any = this.subj.asObservable();

    private parsersMap: Map<FormatType, FormatParser> = new Map();
    private parsedFormatsList: { format: FormatType, parsed: boolean }[];

    constructor(parsers: FormatParser[]) {
        this.initParsers(parsers);
    }

    parseByFormats(formatsList: any[], data: Response[]): void {
        this.parsedFormatsList = formatsList
            // .filter(parseFormatFunc => this[parseFormatFunc])
            .filter((format: FormatType) => this.parsersMap.has(format))
            .map((format: FormatType) => ({ format: format, parsed: false }));

        data.forEach((item, index) => {
            /* check if format parser function exists in Parser prototype */
            // if (this[formatsList[index]]) {
            if (this.parsersMap.has(formatsList[index])) {
                    const asyncResult: Promise<any> = this.parsersMap.get(formatsList[index]).parse(item.text());

                // const asyncResult: Promise<any> = this[formatsList[index]](item);
                asyncResult.then(
                    (result: { format: FormatType, data: any }) => {
                        this.emit(result.format, result.data);
                    },
                    error => {
                        console.error(error);
                    }
                );
            }
        });
    }
    emit(format: FormatType, data: any): void {
        this.parsedFormatsList
            .find((item: { format: FormatType, parsed: boolean }) => item.format === format)
            .parsed = true;
        this.subj.next({ format: format, data: data });

        if (this.parsedFormatsList
                .every((item: { format: FormatType, parsed: boolean }) => item.parsed)) {
            this.subj.complete();
        }
    }

    initParsers(parsers: FormatParser[]) {

        parsers.forEach((parser: FormatParser) => {
            this.parsersMap.set(parser.parserType, parser);
            // Parser.prototype[parser.parserType] = parser.parse;
        });
    }
}




