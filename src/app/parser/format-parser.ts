import { ParserData } from './parser-data.model';
export enum FormatType {
    csv = <any> 'csv',
    xml = <any> 'xml',
    json = <any> 'json',
}

/* if you want to add file formats available for parsing,
add corresponding format to FormatType enum, extend FormatParser class where you put your format parse logic
and add such class as a dependency to ParseAggregator provider in AppModule */

export abstract class FormatParser {
    abstract get parserType(): FormatType;
    abstract parse(response: string): Promise<ParserData>;
}
