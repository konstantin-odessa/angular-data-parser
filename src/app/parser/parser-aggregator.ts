import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/publishLast';
import { Response } from '@angular/http';
import { FormatParser, FormatType } from './format-parser';
import { ParserData } from './parser-data.model';

export class ParserAggregator {
    private subj: ReplaySubject<any> = new ReplaySubject();
    asyncData: any = this.subj.asObservable();

    /* Map of parser functions */
    private parsersMap: Map<FormatType, FormatParser> = new Map();
    /* list of formats which have been parsed */
    /* necessary for subject completion when all data will be parsed */
    private parsedFormatsList: { format: FormatType, parsed: boolean }[];

    constructor(parsers: FormatParser[]) {
        this.initParsers(parsers);
    }

    parseByFormats(formatsList: FormatType[], data: Response[]): void {
        /* filter out formats which haven't corresponding parsers */
        this.parsedFormatsList = formatsList
            .filter((format: FormatType) => this.parsersMap.has(format))
            .map((format: FormatType) => ({ format: format, parsed: false }));

        data.forEach((item, index) => {
            /* check if format parser function exists in parserMap */
            if (this.parsersMap.has(formatsList[index])) {
                    const asyncResult: Promise<ParserData> = this.parsersMap.get(formatsList[index]).parse(item.text());

                asyncResult.then(
                    (result: ParserData) => {
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
        /* send data to subscriber and emit it to app component for future concatenation */
        this.subj.next({ format: format, data: data });

        /* complete subject if all data is parsed */
        if (this.parsedFormatsList
                .every((item: { format: FormatType, parsed: boolean }) => item.parsed)) {
            this.subj.complete();
        }
    }

    /* initialize parser functions */
    initParsers(parsers: FormatParser[]) {
        parsers.forEach((parser: FormatParser) => {
            this.parsersMap.set(parser.parserType, parser);
        });
    }
}




