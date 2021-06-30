import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators{
    static passwordMatching(control: AbstractControl): ValidationErrors|null{
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;
        if ((password !== passwordConfirm)) {    
            console.log((password === passwordConfirm) && (password !== null && passwordConfirm !== null));
            console.log({password, passwordConfirm});                               
            return { passwordsNotMatching: true };
          } else {
            console.log((password === passwordConfirm) && (password !== null && passwordConfirm !== null));
            console.log({password, passwordConfirm});                        
            return null;
          }
    }
}