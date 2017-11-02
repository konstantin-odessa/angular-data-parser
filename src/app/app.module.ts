import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataLoaderService } from './data-loader.service';
import { HttpModule } from '@angular/http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
    ],
    providers: [
        DataLoaderService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
