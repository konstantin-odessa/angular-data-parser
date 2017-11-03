import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataLoaderService } from './data-loader.service';
import { HttpModule } from '@angular/http';
import { GroupPipe } from './sort.pipe';
import { FormatParser } from './parser/format-parser';
import { JsonParser } from './parser/parsers/json-parser';
import { XmlParser } from './parser/parsers/xml-parser';
import { CsvParser } from './parser/parsers/csv-parser';
import { Parser } from './parser/parser';

@NgModule({
    declarations: [
        AppComponent,
        GroupPipe,
    ],
    imports: [
        BrowserModule,
        HttpModule,
    ],

    providers: [
        DataLoaderService,
        JsonParser,
        XmlParser,
        CsvParser,
        {
            provide: Parser,
            useFactory: (...parsers: FormatParser[]) => {
                return new Parser(parsers);
            },
            deps: [
                JsonParser,
                XmlParser,
                CsvParser,
            ]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
