import { FormatParser, FormatType } from '../format-parser';
import { ParserData } from '../parser-data.model';

export class JsonParser extends FormatParser {
    get parserType(): FormatType {
        return FormatType.json;
    }
    parse(response: string): Promise<ParserData> {
        const data = JSON.parse(response);
        return new Promise((resolve, reject) => {
            resolve({ format: FormatType.json, data: data });
        });
    }
}
