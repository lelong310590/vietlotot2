import { Injectable } from '@angular/core';

@Injectable()
export class Helper {
    formatNumber(s) {
        if (s < 10) {
            s = "0" + s.toString();
            return s;
        } else {
            return s;
        }
    }
}