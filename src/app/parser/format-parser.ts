import { ParserData } from './parser-data.model';
export enum FormatType {
    csv = <any> 'csv',
    xml = <any> 'xml',
    json = <any> 'json',
}

export abstract class FormatParser {
    abstract get parserType(): FormatType;
    abstract parse(response: string): Promise<ParserData>;
}
