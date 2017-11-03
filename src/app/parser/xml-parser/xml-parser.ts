import { FormatParser, FormatType } from '../format-parser';
import { Response } from '@angular/http';
import * as xml2js from 'xml2js';

export class XmlParser extends FormatParser {
    get parserType(): FormatType {
        return FormatType.xml;
    }
    parse(response: string): Promise<any> {
        return new Promise((resolve, reject) => {
            xml2js.parseString( response, function (err, result) {
                result.users = result.users.user.map(item => {
                    return {
                        id: item.$.id,
                        firstName: item.firstName ? item.firstName[0] : '',
                        secondName: item.secondName ? item.secondName[0] : '',
                        email: item.email ? item.email[0] : '',
                        phoneNumber: item.phoneNumber ? item.phoneNumber[0] : '',
                    };
                });
                resolve({ format: FormatType.xml, data: result });
            });
        });

    }
}
