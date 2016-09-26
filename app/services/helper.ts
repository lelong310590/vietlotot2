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

    formatMoney(number, places, symbol, thousand, decimal) {
    	number = number || 0;
    	places = !isNaN(places = Math.abs(places)) ? places : 2;
    	symbol = symbol !== undefined ? symbol : "đ";
    	thousand = thousand || ",";
    	decimal = decimal || ".";
    	var negative = number < 0 ? "-" : "";
        var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
        var j = (j = i.length) > 3 ? j % 3 : 0;
    	return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - parseInt(i)).toFixed(places).slice(2) : "") + ' ' + symbol;
    }
}