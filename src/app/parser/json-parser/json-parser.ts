import { FormatParser, FormatType } from '../format-parser';
import { Response } from '@angular/http';

export class JsonParser extends FormatParser {
    get parserType(): FormatType {
        return FormatType.json;
    }
    parse(response: string): Promise<any> {
        const data = JSON.parse(response);
        return new Promise((resolve, reject) => {
            resolve({ format: FormatType.json, data: data });
        });
    }
}
