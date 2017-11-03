import { Response } from '@angular/http';

export enum Formats {
    csv = <any> 'csv',
    xml = <any> 'xml',
    json = <any> 'json',
}

export abstract class FormatParser {
    abstract get parserType(): Formats;
    abstract parse(response: Response): void;
}
