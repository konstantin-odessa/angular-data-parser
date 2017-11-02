import { Parser } from './parser';
import { Response } from '@angular/http';
import * as csvToJson from 'csvtojson';

export class Parser2 extends Parser {
    private csv(response: Response) {
        const self = this;
        const users: any[] = [];
        csvToJson()
            .fromString(response.text())
            .on('json', (jsonObj) => {
                users.push(jsonObj);
            })
            .on('done', () => {
                self.emit('csv', { users: users });
                // console.log('ended!');
            })
            .on('error', (err) => {
                console.error(err);
            });
    }
}
