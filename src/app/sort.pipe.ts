import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
    // pure: false,
})
export class GroupPipe implements PipeTransform {
    transform(data: any[], groupProp: string): any[] {
        return data.sort((a, b) => {
            if (a[groupProp] > b[groupProp]) {
                return 1;
            }
            if (a[groupProp] < b[groupProp]) {
                return -1;
            }
            return 0;
        });
    }
}
