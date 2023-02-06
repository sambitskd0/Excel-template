/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-05-2022
 * Description : Custom validations.
 **/
import {
  FormGroup,
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";

export class CustomValidators {
  alertHelper = new AlertHelper();
  /* Description : allow only nmbers between 0-9 */
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      return false;
    } else {
      return true;
    }
  }

  keyPressAlphabetSpaceDot(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 123) &&
      charCode != 32 &&
      charCode != 46
    ) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  keyPressAlphabetSpaceDotDigit(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode < 48 || charCode > 57) &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 123) &&
      charCode != 32 &&
      charCode != 46
    ) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  camelToTitleCase(txtString: any) {
    const result = txtString.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  camelToSentenceCase(txtString: any) {
    return txtString
      .split(/([A-Z]|\d)/)
      .map((v: any, i: any, arr: any) => {
        // If first block then capitalise 1st letter regardless
        if (!i) return v.charAt(0).toUpperCase() + v.slice(1);
        // Skip empty blocks
        if (!v) return v;
        // Underscore substitution
        if (v === "_") return " ";
        // We have a capital or number
        if (v.length === 1 && v === v.toUpperCase()) {
          const previousCapital = !arr[i - 1] || arr[i - 1] === "_";
          const nextWord =
            i + 1 < arr.length && arr[i + 1] && arr[i + 1] !== "_";
          const nextTwoCapitalsOrEndOfString =
            i + 3 > arr.length || (!arr[i + 1] && !arr[i + 3]);
          // Insert space
          if (!previousCapital || nextWord) v = " " + v;
          // Start of word or single letter word
          if (nextWord || (!previousCapital && !nextTwoCapitalsOrEndOfString))
            v = v.toLowerCase();
        }
        return v;
      })
      .join("");
  }

  /* Created By  : Sambit Kumar Dalai ||  Created On : 19-05-2022  || Description : allow only numbers  */
  onlyNumber(event: any) {
    event = event ? event : window.event;
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  /* Created By  : Swagatika ||  Created On : 25-05-2022  || Description : Allow Only Numbers with Decimals  */
  keyPressNumbersDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /* Created By  : Swagatika ||  Created On : 25-05-2022  || Description : Allow Only Numbers with Decimals and - */
  keyPressLatLong(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode != 45 &&
      charCode != 46 &&
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /* Created By  : Swagatika ||  Created On : 25-05-2022  || Description : Allow Only Numbers with Decimals and - */
  keyPressLandline(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode != 45 &&
      charCode != 40 &&
      charCode != 41 &&
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /* Created By  : Debasis Patra ||  Created On : 31-05-2022  || Description : Aadhaar Validation (Verhoff)  */
  // validates Aadhar number received as string
  validate(aadharNumber: any) {
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    ];

    // permutation table
    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
    ];
    let c = 0;
    let invertedArray = aadharNumber.split("").map(Number).reverse();

    invertedArray.forEach((val: any, i: any) => {
      c = d[c][p[i % 8][val]];
    });

    return c === 0;
  }

  /* Created By  : Debasis Patra ||  Created On : 31-05-2022  || Description : Check File type  */
  checkFileType(control: AbstractControl): { [key: string]: any } | null {
    let filename = control.value;
    var ext = filename.substring(filename.lastIndexOf(".") + 1);
    let forbidden = true;
    if (ext === "pdf") {
      forbidden = false;
    }
    return forbidden ? { invalid_type: true } : null;
  }

  /* Created By  : Debasis Patra ||  Created On : 31-05-2022  || Description : Check File Size Validation  */
  fileSizeValidator(files: FileList, size: any) {
    return function (control: FormControl) {
      // return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file) {
        var path = file.replace(/^.*[\\\/]/, "");
        const fileSize = files[0].size;
        const fileSizeInKB = Math.round(fileSize / 1024);
        if (fileSizeInKB > size) {
          return {
            fileSizeValidator: true,
          };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  /* Created By  : Debasis Patra ||  Created On : 31-05-2022  || Description : Check File Type Validation  */
  requiredFileType(type: string[]) {
    return function (control: FormControl) {
      // return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      var existValue: boolean = false;
      if (file) {
        var path = file.replace(/^.*[\\\/]/, "");

        const extension = path.split(".")[1].toUpperCase();
        for (var i = 0; i < type.length; i++) {
          let typeFile = type[i].toUpperCase();
          if (typeFile === extension.toUpperCase()) {
            existValue = true;
          }
        }
        if (existValue == true) {
          return null;
        } else {
          return {
            requiredFileType: true,
          };
        }
      }
      return null;
    };
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 16-05-2022  || Description : allow only alphabets between a-z or A-Z  */
  onlyAlphabets(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9 and space
    if (charCode === 32) return true;
    if (charCode < 65 || charCode > 122 || (charCode > 90 && charCode < 97))
      return false;
    return true;
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 16-05-2022  || Description : allow only alphabets between a-z or A-Z  */
  onlyNumbersWithDecimal(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode === 46) return true;
    if (charCode < 48 || charCode > 57) return false;
    return true;
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : Check for special characters  */
  checkSpecialChar(event: any): boolean {
    const charCode = event?.which ? event?.keyCode : event?.which;
    return (
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 8 ||
      charCode == 32 ||
      (charCode >= 48 && charCode <= 57)
    );
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : Check word start with white space */
  firstCharValidator(event: any) {
    const validatorArr = [
      event.target.value.startsWith(" "),
      event.target.value.startsWith("."),
    ];

    if (validatorArr.includes(true)) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Space/dot not allowed as first character."
      );
    }
  }

  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : Check alphabet with comma */
  alphabetWithComma(event: any) {
    const charCode = event?.which ? event?.keyCode : event?.which;
    if (charCode === 44) return true;
    if (charCode < 65 || charCode > 122 || (charCode > 90 && charCode < 97))
      return false;
    return true;
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : Check alphabet with comma and space */
  alphaNumericWithCommaSpace(event: any) {
    const charCode = event?.which ? event?.keyCode : event?.which;
    if (charCode === 44 || charCode === 32) return true;
    if (charCode >= 48 && charCode <= 57) return true;
    if (charCode < 65 || charCode > 122 || (charCode > 90 && charCode < 97))
      return false;
    return true;
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : customizable alphanumeric validator */
  alphaNumericValidator(event: any, ...types: any) {
    const charCode = event.which ? event.keyCode : event.which;

    // allow comma
    if (types.includes("comma") && charCode === 44) return true;
    if (types.includes("plus") && charCode === 43) return true;
    if (types.includes("space") && charCode === 32) return true;
    if (types.includes("dot") && charCode === 46) return true;
    if (types.includes("hyphen") && charCode === 45) return true;
    if (types.includes("slash") && charCode === 47) return true;
    if (types.includes("singleQuote") && charCode === 39) return true;
    if (types.includes("leftParaanthesis") && charCode === 40) return true;
    if (types.includes("rightParaanthesis") && charCode === 41) return true;
    // ==== default condition for alphabets and numbers

    if (charCode >= 48 && charCode <= 57) return true;
    if (charCode >= 65 && charCode <= 90) return true;
    if (charCode >= 97 && charCode <= 122) return true;
    //end
    return false;
  }

  // ================================= Reactive form Validations

  /* Created By  : Sambit Kumar Dalai ||  Created On : 16-05-2022  || Description : Central client side validator  */
  formValidationHandler(
    formGroup: FormGroup,
    labels: string[],
    elementRef: any = undefined,
    customMessage: any = undefined
  ): any {
    if (formGroup.invalid === true) {
      let i = 0;
      for (let iterator in formGroup.controls) {
        // focus
        if (formGroup.controls[iterator]?.invalid) {
          elementRef?.nativeElement
            .querySelector('[formControlName="' + iterator + '"]')
            ?.focus();
        } // end

        if (formGroup.controls[iterator].errors?.["required"] === true) {
          let message = "";
          // custom message
          if (customMessage !== undefined && customMessage?.required?.[iterator])
            message = customMessage?.required?.[iterator];
          else message = `${labels[i]} is required`; // default message

          this.alertHelper.viewAlert("error", "Invalid", message);
          return [labels[i], true];
        }

        if (formGroup.controls[iterator].errors?.["email"] === true) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Invalid mail id for ${labels[i].toLowerCase()}`
          );
          return [labels[i], true];
        }

        // ===== conditional required validation
        if (
          formGroup.controls[iterator].errors?.["conditionalValidation"]
            ?.required === true
        ) {
          let message = "";
          // custom message
          if (customMessage !== undefined && customMessage?.conditionalValidation?.[iterator])
            message = customMessage?.conditionalValidation?.[iterator];
          else message = `${labels[i]} is required`; // default message

          this.alertHelper.viewAlert("error", "Invalid", message);
          return [labels[i], true];
        }
        if (formGroup.controls[iterator].errors?.["maxlength"] !== undefined) {
          const { actualLength, requiredLength } =
            formGroup.controls[iterator].errors?.["maxlength"];
          if (actualLength !== requiredLength) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${labels[i]} length should be maximum ${requiredLength} characters.`
            );
          }

          return [labels[i], true];
        }
        if (formGroup.controls[iterator].errors?.["minlength"] !== undefined) {
          const { actualLength, requiredLength } =
            formGroup.controls[iterator].errors?.["minlength"];
          if (actualLength !== requiredLength) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${labels[i]} length should be minimum ${requiredLength} characters.`
            );
          }

          return [labels[i], true];
        }

        if (formGroup.controls[iterator].errors?.["max"] !== undefined) {
          const { actual, max } = formGroup.controls[iterator].errors?.["max"];
          if (actual !== max) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${labels[i]} should be maximum ${max}.`
            );
          }
          return [labels[i], true];
        }

        if (formGroup.controls[iterator].errors?.["min"] !== undefined) {
          // console.log(formGroup.controls[iterator].errors?.["min"]);
          let tmpMsg: any = "";
          const { actual, min } = formGroup.controls[iterator].errors?.["min"];
          if (actual !== min) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${labels[i]} should be minimum ${min}`
            );
          }
          if (actual !== min) {
            if (min > 1) {
              tmpMsg = `${labels[i]} should be minimum ${min}`;
            } else {
              tmpMsg = `${labels[i]} should not be zero`;
            }
            this.alertHelper.viewAlert("error", "Invalid", tmpMsg);
          }
          return [labels[i], true];
        }

        if (formGroup.controls[iterator].errors?.["pattern"] !== undefined) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Invalid input for ${labels[i]?.toLowerCase()}`
          );

          return [labels[i], true];
        }
        if (
          formGroup.controls[iterator].errors?.["firstCharValidatorRF"] !==
          undefined
        ) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Space/dot not allowed as first character in ${labels[
              i
            ].toLowerCase()} `
          );

          return [labels[i], true];
        }
        i++;
      }
    }
    return false;
  }

  /* Created By  : Swagatika ||  Created On : 20-05-2022  || Description : custom client side form validator  */
  customFormValidationHandler(formGroup: FormGroup): any {
    if (formGroup.invalid === true) {
      let i = 0;
      for (const iterator in formGroup.controls) {
        // console.log(formGroup.controls[iterator].errors?.["max"]);
        if (formGroup.controls[iterator].errors?.["required"] === true) {
          //formGroup.controls[iterator].focus();
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `${this.camelToSentenceCase(iterator)} can not be left blank`
          );
          return [this.camelToSentenceCase(iterator), true];
        }

        // ===== conditional required validation
        if (
          formGroup.controls[iterator].errors?.["conditionalValidation"]
            ?.required === true
        ) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `${this.camelToSentenceCase(iterator)} can not be left blank`
          );

          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["max"] !== undefined) {
          const { actual, max } = formGroup.controls[iterator].errors?.["max"];
          if (actual !== max) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${this.camelToSentenceCase(iterator)} should be maximum ${max}.`
            );
          }
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["min"] !== undefined) {
          //console.log(formGroup.controls[iterator].errors?.["min"]);
          let tmpMsg: any = "";
          const { actual, min } = formGroup.controls[iterator].errors?.["min"];
          if (actual !== min) {
            if (min > 1) {
              tmpMsg = `${this.camelToSentenceCase(
                iterator
              )} should be minimum ${min}`;
            } else {
              tmpMsg = `${this.camelToSentenceCase(
                iterator
              )} should not be zero`;
            }
            this.alertHelper.viewAlert("error", "Invalid", tmpMsg);
          }
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["maxlength"] !== undefined) {
          const { actualLength, requiredLength } =
            formGroup.controls[iterator].errors?.["maxlength"];
          if (actualLength !== requiredLength) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${this.camelToSentenceCase(
                iterator
              )} length should be maximum ${requiredLength} characters.`
            );
          }
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["minlength"] !== undefined) {
          const { actualLength, requiredLength } =
            formGroup.controls[iterator].errors?.["minlength"];
          if (actualLength !== requiredLength) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${this.camelToSentenceCase(
                iterator
              )} length should be minimum ${requiredLength} characters.`
            );
          }
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["email"] === true) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Invalid mail id for ${this.camelToSentenceCase(iterator)}`
          );
          return [this.camelToSentenceCase(iterator), true];
        }

        if (
          formGroup.controls[iterator].errors?.["firstCharValidatorRF"] !==
          undefined
        ) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Space/dot not allowed as first character in ${this.camelToSentenceCase(
              iterator
            )} `
          );
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["pattern"] !== undefined) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Invalid input for ${this.camelToSentenceCase(iterator)}`
          );
          return [this.camelToSentenceCase(iterator), true];
        }

        if (formGroup.controls[iterator].errors?.["ageRange"] !== undefined) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            `Please enter a valid date for ${this.camelToSentenceCase(
              iterator
            )} `
          );
          return [this.camelToSentenceCase(iterator), true];
        }

        i++;
      }
    }
    return false;
  }

  /* Created By  : Swagatika ||  Created On : 25-08-2022  || Description : validate min and max age   */
  ageRangeValidator(min: number, max: number = 100): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        control.value !== undefined &&
        (isNaN(control.value) || control.value < min || control.value > max)
      ) {
        return { ageRange: true };
      }
      return null;
    };
  }

  formArrayValidationHandler(formGroup: FormGroup, labels: string[]): any {
    let allErrors: any = [];
    if (formGroup.invalid === true) {
      let i = 0;
      for (let iterator in formGroup.controls) {
        if (formGroup.controls[iterator].status === "INVALID") {
          if (formGroup.controls[iterator].errors?.["required"] === true) {
            let msg = `${labels[i]} required`;
            console.log(msg);
            allErrors.push(msg);
          }

          if (formGroup.controls[iterator].errors?.["email"] === true) {
            let msg = `Invalid mail id for ${labels[i]}`;
            allErrors.push(msg);
          }

          // ===== conditional required validation
          if (
            formGroup.controls[iterator].errors?.["conditionalValidation"]
              ?.required === true
          ) {
            let msg = `${labels[i]} required`;
            allErrors.push(msg);
          }

          if (
            formGroup.controls[iterator].errors?.["maxlength"] !== undefined
          ) {
            const { actualLength, requiredLength } =
              formGroup.controls[iterator].errors?.["maxlength"];
            if (actualLength !== requiredLength) {
              let msg = `${labels[i]} length should be maximum ${requiredLength} characters.`;
              allErrors.push(msg);
            }
          }

          if (
            formGroup.controls[iterator].errors?.["minlength"] !== undefined
          ) {
            const { actualLength, requiredLength } =
              formGroup.controls[iterator].errors?.["minlength"];
            if (actualLength !== requiredLength) {
              let msg = `${labels[i]} length should be minimum ${requiredLength} characters.`;
              allErrors.push(msg);
            }
          }

          if (formGroup.controls[iterator].errors?.["max"] !== undefined) {
            const { actual, max } =
              formGroup.controls[iterator].errors?.["max"];
            if (actual !== max) {
              let msg = `${labels[i]} should be maximum ${max}.`;
              allErrors.push(msg);
            }
          }

          if (formGroup.controls[iterator].errors?.["min"] !== undefined) {
            // console.log(formGroup.controls[iterator].errors?.["min"]);
            let tmpMsg: any = "";
            const { actual, min } =
              formGroup.controls[iterator].errors?.["min"];
            if (actual !== min) {
              let msg = `${labels[i]} should be minimum ${min}`;
              allErrors.push(msg);
            }
            if (actual !== min) {
              if (min > 1) {
                tmpMsg = `${labels[i]} should be minimum ${min}`;
              } else {
                tmpMsg = `${labels[i]} should not be zero`;
              }
              allErrors.push(tmpMsg);
            }
          }

          if (formGroup.controls[iterator].errors?.["pattern"] !== undefined) {
            let msg = `Invalid input for ${labels[i]}`;
            allErrors.push(msg);
          }

          if (
            formGroup.controls[iterator].errors?.["firstCharValidatorRF"] !==
            undefined
          ) {
            let msg = `Space/dot not allowed as first character in ${labels[i]} `;
            allErrors.push(msg);
          }
        }

        i++;
      }
    }
    return allErrors;
  }

  firstCharValidatorRF(control: AbstractControl): ValidationErrors | null {
    // 1) if input is number type
    if (
      typeof control.value === "number" &&
      control.value.toString().indexOf(" ") == 0
    ) {
      return { firstCharValidatorRF: true };
    }
    // 2) if input is string type
    if (
      typeof control.value === "string" &&
      (control.value as string).indexOf(" ") == 0
    ) {
      return { firstCharValidatorRF: true };
    }

    return null;
  }

  keyPressDotSlashComma(event: any) {
    var regex = new RegExp("^[a-zA-Z0-9, ./-]+$");
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      //  return false;
    }
  }

  keyPressAlphSlashUnderscore(event: any) {
    var regex = new RegExp("^[a-zA-Z /_]+$");
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      //  return false;
    }
  }
  /* Created By  : Sambit Kumar Dalai ||  Created On : 06-06-2022  || Description : customizable alphanumeric validator */
  eyeCheckupParameterValidator(event: any, ...types: any) {
    const charCode = event.which ? event.keyCode : event.which;
    if (types.includes("dot") && charCode === 46) return true;
    if (types.includes("hyphen") && charCode === 45) return true;
    if (types.includes("plus") && charCode === 43) return true;
    if (types.includes("slash") && charCode === 47) return true;
    // ==== default condition for alphabets and numbers
    if (charCode >= 48 && charCode <= 57) return true;
    //end
    return false;
  }
}
