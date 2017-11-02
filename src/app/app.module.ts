import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataLoaderService } from './data-loader.service';
import { HttpModule } from '@angular/http';
import { GroupPipe } from './sort.pipe';
import { Parser } from './parser/parser';
import { Parser2 } from './parser/parser2';

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
        {
            provide: Parser,
            useClass: Parser2,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
