import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Injectable({
     providedIn: 'root'
})
export class AutoComplateService {

     constructor() { }

     searchFun(FormControl: FormControl, itemArray, field: string) {
          return FormControl.valueChanges.pipe(
               startWith(''),
               map(value => {
                    const name = typeof value === 'string' ? value : value?.[field];
                    return name ? this.filter(name as string, itemArray, field) : itemArray.slice();
               })
          );
     }

     filter(name: string, arrayy, field): any[] {
          const filterValue = name.toLowerCase();
          return arrayy.filter(option => option[field].toLowerCase().includes(filterValue));
     }


     searchFun2(FormControl: FormControl, itemArray) {
          return FormControl.valueChanges.pipe(
               startWith(''),
               map(value => this._filter(value || '', itemArray)),
          );
     }
     private _filter(value: string, itemArray): string[] {
          console.log(itemArray);
          const filterValue = value.toLowerCase();
          return itemArray.filter(option => option.toLowerCase().includes(filterValue));
     }
}
