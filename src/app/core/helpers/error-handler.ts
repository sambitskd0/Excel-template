/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 30-05-2022
 * Description : Error handler.
 **/
import { AlertHelper } from "./alert-helper";

export class ErrorHandler extends AlertHelper {
  serverSideErrorHandler(error: any) {
    // ==== convert object to array
    const result: any = Object.keys(error.error.msg).map((key) => [
      error.error.msg[key],
    ]);

    let errorMessage: string = "";
    if (typeof error.error.msg === "string") {
      errorMessage +=
        '<i class="bi bi-arrow-right text-danger"></i> ' +
        error.error.msg +
        `<br>`;
    } else {
      result.map(
        (message: string) =>
          (errorMessage +=
            '<i class="bi bi-arrow-right text-danger"></i> ' + message + `<br>`)
      );
    }

    this.viewAlertHtml("error", "Invalid inputs", errorMessage);
  }
}
