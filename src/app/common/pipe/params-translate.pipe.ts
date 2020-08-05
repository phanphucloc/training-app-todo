import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, first } from 'rxjs/operators';

@Pipe({
name: 'ParamsTranslate'
})
export class ParamsTranslatePipe implements PipeTransform {
constructor(private translate$: TranslateService) {}

transform(obj: object): object {
    const newObject = Object.assign({}, obj);
    Object.keys(obj).forEach(
        key =>
            obj[key].length
                ? this.translate$
                      .get(obj[key])
                      .pipe(first(), map(value => value))
                      .subscribe(value => (newObject[key] = value))
                : undefined
    );
    return newObject;
}
}