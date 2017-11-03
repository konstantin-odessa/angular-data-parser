import { FormatParser, FormatType } from '../format-parser';
import { Response } from '@angular/http';
import * as csvToJson from 'csvtojson';

export class CsvParser extends FormatParser {
    get parserType(): FormatType {
        return FormatType.csv;
    }
    parse(response: string): Promise<any> {
        const users: any[] = [];
        return new Promise((resolve, reject) => {
            csvToJson()
                .fromString(response)
                .on('json', (jsonObj) => {
                    users.push(jsonObj);
                })
                .on('done', () => {
                    resolve({ format: FormatType.csv, data: { users: users } });
                })
                .on('error', (err) => {
                    reject(err);
                    console.error(err);
                });
        });

    }
}
