import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { QuestionBankService } from "../../services/question-bank.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
@Component({
  selector: "app-download-question",
  templateUrl: "./download-question.component.html",
  styleUrls: ["./download-question.component.css"],
})
export class DownloadQuestionComponent implements OnInit {
  questionData!: any;
  assessmentDetails!: any;
  @ViewChild("pdfContent") pdfContentRef!: ElementRef;
  public fileUrl = environment.filePath;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  visibilityStatus = false;

  // schoolName:any = '';
  // schoolCode:any = '';

  //Done by : Sailesh Mishra on 28-12-2022
  public users = this.commonserviceService.getUserProfile();
  schoolName = this.users?.userName;
  schoolCode = this.users?.udiseCode;
  //end

  constructor(
    public commonserviceService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private questionBankService: QuestionBankService
  ) {
    this.commonserviceService.pageSetup(true); // remove side nav and header
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.questionData = JSON.parse(localStorage?.getItem("allQuestions") || "");
    localStorage.removeItem("allQuestions");
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.openPDF();
    }, 1);
  }

  public openPDF(): void {
    this.visibilityStatus = true;
    html2canvas(this.pdfContentRef.nativeElement, { useCORS: true }).then(
      (canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL("image/jpeg");
        let PDF = new jsPDF("p", "mm", "a4");
        let position = 0;
        PDF.addImage(FILEURI, "JPEG", 0, position, fileWidth, fileHeight);
        PDF.save("Questions.pdf");
        window.open("", "_self")?.close();
      }
    );
  }
}
