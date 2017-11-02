import { Component } from '@angular/core';
import { DataLoaderService } from './data-loader.service';
import { Observable } from 'rxjs/Observable';
import { Parser } from './parser/parser';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    formatList: string[] = ['json', 'xml'];

    constructor(private dataLoaderService: DataLoaderService) {
    }

    concatenate(result: any[], curr: any[]): void {
        for (let i = 0; i < curr.length; i++) {
            const obj = curr[i];
            const id = obj.id;
            let res = result.find(item => item.id === id);
            res ? res = assign(res, obj) : result.push(obj);
        }

        function assign(obj1, obj2) {
            const source = Object.keys(obj1) > Object.keys(obj2) ? Object.keys(obj1) : Object.keys(obj2);
            return source.forEach((key) => {
                obj1[key] = obj2[key] ? obj2[key] : obj1[key];
            });
        }
    }

    readData() {
        this.dataLoaderService.getData(this.formatList, this.concatenate)
            .subscribe((parser: Parser) => {
                parser.asyncData.subscribe(data => console.log(data));
                parser.parseByFormats();
            });
    }
}
