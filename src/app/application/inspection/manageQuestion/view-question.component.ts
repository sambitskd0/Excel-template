import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageQuestionService } from "../services/manage-question.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })

  datatableElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private apiURL = environment.masterAPI;

  allQuestions: any;

  questSearchform!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any; 
  resData: any = "";
  isResData: boolean = false;
  isEmpty: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    public ManageQuestionService: ManageQuestionService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route:Router,
    private router:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.spinner.show(); 
    
    this.questSearchform = this.formBuilder.group({
      questionCategory: "0"
    });


    this.dtOptions = {
      pagingType: "full_numbers",
      processing: false,
      ordering: true,
      dom: 'Blfrtip',
      buttons: [
        
      ]
  
    };
    this.loadProfile();
    $.fn["dataTable"].ext.search.push(
      (settings: any, data: string[], dataIndex: any) => {
        
        if (this.questSearchform.get("questionCategory")?.value == data[1] || this.questSearchform.get("questionCategory")?.value =="0") {
          return true;
        }
        return false;
      }
    );
  }

  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }

  loadProfile(){
    this.ManageQuestionService
      .viewQuestion(this.questSearchform.value)
      .subscribe((data: []) => {
        this.allQuestions = data;
        this.allQuestions = this.allQuestions.data;
        this.resData = true;
        this.isEmpty = this.allQuestions.length > 0 ? false : true;
        this.spinner.hide();
        this.isResData = true;
        if(this.datatableElement && this.resData.length > 0) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {               
            if ($('.dataTables_empty').length > 0) {
              $('.dataTables_empty').remove();
            }                
          });
        }
        
      });
  }

  filterRecord(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
    
  }

  deleteQuestion(encId: string){
    this.alertHelper
      .deleteAlert(
        "Are you sure to delete?",
        " ",
        "question",
        "Yes, delete it!"
      )
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.ManageQuestionService.deleteQuestion(encId).subscribe((res) => {
            this.spinner.hide();
            this.alertHelper.successAlert(
              "Deleted!",
              "Deleted Successfully",
              "success"
            
            ).then(()=>{
              window.location.reload();
            });
          });
        }
      });
  }

}