import { Component } from '@angular/core';
import { DataLoaderService } from './data-loader.service';
import { Observable } from 'rxjs/Observable';
import { FormatType } from './parser/format-parser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    /* file formats to parse */
    formatList: FormatType[] = [FormatType.json, FormatType.xml, FormatType.csv];
    /* parsed and concatenated data */
    formattedData: any[] = [];

    /* table layout */
    tableHeading: any[] = [];
    /* disable btn when clicked "loadData" */
    isDataLoaded = false;
    sortBy: string;

    constructor(private dataLoaderService: DataLoaderService) {
    }

    sorter(value: string) {
        this.sortBy = value;
    }

    /* this function concatenates parsed data objects */

    concatenate(result: any[], curr: any[]): void {
        for (let i = 0; i < curr.length; i++) {
            const obj = curr[i];
            const id = obj.id;
            let res = result.find(item => item.id === id);
            res ? res = assign(res, obj) : result.push(obj);
        }

        /* replace object properties from first argument by object properties from second argument */
        function assign(obj1, obj2) {
            const source = Object.keys(obj1) > Object.keys(obj2) ? Object.keys(obj1) : Object.keys(obj2);
            return source.forEach((key) => {
                obj1[key] = obj2[key] ? obj2[key] : obj1[key];
            });
        }
    }

    loadData() {
        this.dataLoaderService.getData(this.formatList)
            .subscribe((asyncData: Observable<any>) => {
                let jsonData: any;
                asyncData
                    .subscribe((dataObj: { format: FormatType, data: any }) => {
                            /* store data if type of file === json */
                            if (dataObj.format === FormatType.json) {
                                jsonData = dataObj.data.users;
                                return;
                            }
                            this.concatenate(this.formattedData, dataObj.data.users);
                            console.log(this.formattedData);
                        },
                        (err) => { console.error('Error: %s', err); },
                        () => {
                            console.log('parsing completed!');
                            /* concatenate data from parsed json file */
                            /* we do this because we want json data override for object properties */
                            this.concatenate(this.formattedData, jsonData);
                            /* data to fill table heading */
                            this.tableHeading = Object.keys(this.formattedData[0]);
                            this.isDataLoaded = true;
                            /* sort by id */
                            this.sorter('id');
                        });
            });
    }
}
