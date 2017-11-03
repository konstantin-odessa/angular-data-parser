import { Component } from '@angular/core';
import { DataLoaderService } from './data-loader.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    /* file formats to parse */
    formatList: string[] = ['json', 'xml', 'csv'];
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
    /* and   */
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

    loadData() {
        this.dataLoaderService.getData(this.formatList)
            .subscribe((asyncData: Observable<any>) => {
                let jsonData: any;
                asyncData
                    .subscribe((dataObj: { format: string, data: any }) => {
                            if (dataObj.format === 'json') {
                                jsonData = dataObj.data.users;
                                return;
                            }
                            this.concatenate(this.formattedData, dataObj.data.users);
                            console.log(this.formattedData);
                        },
                        (err) => { console.error('Error: %s', err); },
                        () => {
                            console.log('parsing completed!');
                            this.concatenate(this.formattedData, jsonData);
                            /* data to fill table heading */
                            this.tableHeading = Object.keys(this.formattedData[0]);
                            this.isDataLoaded = true;
                            this.sorter('id');
                        });
            });
    }
}
