import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { formatDate } from "@angular/common";
import { ManageTrainingBatchService } from "../../services/manage-training-batch.service";
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";
declare var $: any;
@Component({
  selector: "app-add-training-batch",
  templateUrl: "./add-training-batch.component.html",
  styleUrls: ["./add-training-batch.component.css"],
})
export class AddTrainingBatchComponent implements OnInit {
  CreateTraining!: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  createdBy: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  trainingLevel: any = "";
  trainingType: any = "";
  description: any = "";
  lastDateTraining: any = "";
  trainingMode: any = "";
  scDisrtictChanged: boolean = false;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userLevel = this.userProfile.userLevel;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  scBlockChanged: boolean = false;
  blockData: any = [];
  scClusterChanged: boolean = false;
  desgNameChanged: boolean = false;
  scDesgChanged: boolean = false;
  
  tLocationChanged: boolean = false;
  clusterData: any;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  departmentList:any = "";

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "Training Subject",
    "Training Name",
    "Training Department",
    "Training Level",
    "",
    "",
    "Training Location",
    "Total no of master",
    "Create Batches",
    // "Training Start Date",
    // "Training End Date",
  ];

  trainingModeChanged = false;
  trainingSubjectChanged = false;
  trainingTypeChanged = true;

  data: any;
  res: any;
  training: any;
  teacherTraningid: any;
  batches = [
    { id: 1, batchName: "Batch A" },
    { id: 2, batchName: "Batch B" },
    { id: 3, batchName: "Batch C" },
    { id: 4, batchName: "Batch D" },
    { id: 5, batchName: "Batch E" },
    { id: 6, batchName: "Batch F" },
    { id: 7, batchName: "Batch G" },
    { id: 8, batchName: "Batch H" },
    { id: 9, batchName: "Batch I" },
    { id: 10, batchName: "Batch J" },
  ];
  department: any;
  tLocation: any;
  noOfMaster: any;
  batchesList: any;
  startDate: any;
  endDate: any;
  totalNoTrainer: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  trainingId: any;
  trainingNameLoad: boolean = false;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    traningLoc: false,
    departmentload: false,
    noOfMasterload:false,
  };
  trainingLevelType: any;
  trainingLocationType: any;
  trainingDepartment: any;
  trainingLevelTypes: any;
  anxtName: any;
  anxtValue: any;
  preAndPastYear:any = [];
  teacherListData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private trainingTypeServices: ManageTrainingBatchService,
    private trainingServices: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.spinner.show();
    this.initializeForm();
    this.getSubjectList();

    this.dropdownSettings = {
      idField: "id",
      textField: "batchName",
      enableCheckAll: true,
      selectAllText: "Select All Batches",
      unSelectAllText: "UnSelect All Batches",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };

    this.getDistrict();
    this.getTrainingLevel();
    this.getTrainingLocation();
    this.getTrainingDepartment();
    
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=trainingSubject]").focus();
  }

  getPresentAndPastAcademicYear(){
    var splitted = this.academicYear.split("-", 2);
    var y1 = splitted[0] - 1;
    var y2 = splitted[1] - 1;
    var y3 = y1+"-"+y2;
    const spilit = this.academicYear+","+y3;
    this.preAndPastYear = spilit.split(",");
  }

  getTrainingDepartment() {
    this.loadingObj.departmentload = true;
    this.departmentList = [];
    this.trainingTypeServices.getTrainingDepartment().subscribe((data: any) => {
      let datas: any = data;
      for (let key of Object.keys(datas["data"])) {
        this.departmentList.push(datas["data"][key]);
      }
      //console.log(this.departmentList);
      this.loadingObj.departmentload = false;
    });
  }

  getTrainingLevel() {
    this.trainingServices.getTrainingLevl().subscribe((data: any) => {
      this.trainingLevelTypes = data.data;
      this.trainingLevelTypes.forEach((val: any, key: any) => {
        if (this.userProfile.userLevel == val.anxtValue) {
          this.anxtName = val.anxtName;
          this.anxtValue = val.anxtValue;
        }
      });
      this.CreateTraining.controls["trainingLevel"].patchValue(this.userProfile.userLevel);
    });
  }

  getTrainingLocation() {
    this.loadingObj.traningLoc = true;
    this.trainingServices.getTrainingLocation().subscribe((data: any) => {
      this.trainingLocationType = data.data;
      this.loadingObj.traningLoc = false;
    });
  }

  getSubjectList() {
    this.trainingId = "";
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
      this.spinner.hide();
    });
  }

  getTrainingName(id: any) {
    this.trainingId = "";
    this.noOfMaster = "";
    this.CreateTraining.get("trainingId")?.patchValue("");
    this.CreateTraining.get("noOfMaster")?.patchValue("");
    //this.CreateTraining.get("trainingLevel")?.patchValue("");
    this.loadingObj.traiingLoading = true;
    this.trainingServices.getTrainingDetails(id).subscribe((data: any) => {
      if (data == null) {
        this.training = [];
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      } else {
        this.training = data.data;
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      }
    });
  }

  showTeacherList(e:any){
    this.spinner.show();
    if(this.userLevel == 5){
      e['trainingLevel'] = 5;
      e['scDistrictId'] = "";
      e['scBlockId'] = "";
    }else if(this.userLevel == 4){
      e['trainingLevel'] = 4;
      e['scDistrictId'] = this.userProfile.district;
      e['scBlockId'] = "";
    }else if(this.userLevel == 3){
      e['trainingLevel'] = 3;
      e['scDistrictId'] = this.userProfile.district;
      e['scBlockId'] = this.userProfile.block;
    }
    
    this.trainingTypeServices.getTeacherList(e).subscribe((res: any) => {
      this.teacherListData = res.data;
      this.spinner.hide();
      });
  
  }

  getDistrict() {
    this.loadingObj.districtLoad = true;
    this.blockData = [];

    this.scBlockId = "";
    this.scDisrtictChangedload = true;
    this.scBlockChanged = true;
    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.districtData = res;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.CreateTraining.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.CreateTraining.controls["trainingLevel"].patchValue(this.userProfile.userLevel);
        this.getBlock(this.userProfile.district);
        this.loadingObj.districtLoad = false;
      } else {
        this.districtData = this.districtData;
        this.loadingObj.districtLoad = false;
      }
      this.loadingObj.districtLoad = false;
    });
  }

  getBlock(id: any) {
    this.loadingObj.blockLoad = true;
    this.CreateTraining.controls["scBlockId"].patchValue("");

    const districtId = id;
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData.data;
          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.CreateTraining.controls["scBlockId"].patchValue(
              this.userProfile.block
            );
            //this.CreateTraining.controls["trainingLevel"].patchValue("2");
            this.loadingObj.blockLoad = false;
          } else {
            this.blockData = this.blockData;
            this.loadingObj.blockLoad = false;
          }
          this.loadingObj.blockLoad = false;
        });
    } else {
      this.loadingObj.blockLoad = false;
    }
  }

  initializeForm() {
    this.CreateTraining = this.formBuilder.group({
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingId: [this.trainingId, [Validators.required]],
      department: [this.department, [Validators.required]],
      trainingLevel: [this.trainingLevel, [Validators.required]],
      scDistrictId: [this.scDistrictId],
      scBlockId: [this.scBlockId],
      tLocation: [this.tLocation, [Validators.required]],
      noOfMaster: [this.noOfMaster, [Validators.required,Validators.min(1)]],
      batchesList: [this.batchesList, 
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
          Validators.max(6),
        ],
      ],
      // startDate: [this.startDate, [Validators.required]],
      // endDate: [this.endDate, [Validators.required]],
      createdBy: [this.userProfile.userId],
    });
  }

  checkValid(e:any){
    if (e.level === "4") {
      this.CreateTraining.controls["scDistrictId"].setValidators([Validators.required]);
      this.CreateTraining.controls["scDistrictId"].updateValueAndValidity();
      this.allLabel = [
        "Training Subject",
        "Training Name",
        "Training Department",
        "Training Level",
        "",
        "District",
        "",
        "Training Location",
        "Total no of master",
        "Create Batches",
        // "Training Start Date",
        // "Training End Date",
      ];
    }else if (e.level === "3"){
      this.CreateTraining.controls["scDistrictId"].setValidators([Validators.required]);
      this.CreateTraining.controls["scBlockId"].setValidators([Validators.required]);
      this.CreateTraining.controls["scDistrictId"].updateValueAndValidity();
      this.CreateTraining.controls["scBlockId"].updateValueAndValidity();
      this.allLabel = [
        "Training Subject",
        "Training Name",
        "Training Department",
        "Training Level",
        "",
        "District",
        "Block",
        "Training Location",
        "Total no of master",
        "Create Batches",
        // "Training Start Date",
        // "Training End Date",
      ];
    }else{
      this.allLabel = [
        "",
        "Training Subject",
        "Training Name",
        "Training Department",
        "Training Level",
        "",
        "",
        "Training Location",
        "Total no of master",
        "Create Batches",
        // "Training Start Date",
        // "Training End Date",
      ];
      this.CreateTraining.controls["scDistrictId"].setValidators([Validators.nullValidator]);
      this.CreateTraining.controls["scBlockId"].setValidators([Validators.nullValidator]);
      this.CreateTraining.controls["scDistrictId"].updateValueAndValidity();
      this.CreateTraining.controls["scBlockId"].updateValueAndValidity();
    }
    //this.getTeacherCount(e);
  }

  onSubmit() {
    this.submitted = true;
    
    // if ("INVALID" === this.CreateTraining.status) {
    //   for (const key of Object.keys(this.CreateTraining.controls)) {
    //     if (this.CreateTraining.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.CreateTraining,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if(this.CreateTraining.invalid){
      this.customValidators.formValidationHandler(
                this.CreateTraining,
                this.allLabel,
                this.el
              );
    }

    if (this.CreateTraining.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .saveBatches(this.CreateTraining.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner

                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Training batches created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["./../viewTrainingBatch"], {
                      relativeTo: this.router,
                    });
                    //this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              complete: () => console.log("done"),
            });
        }
      });
    }
  }

  getTeacherCount(e: any) {
    //this.CreateTraining.get("trainingLevel")?.patchValue('');
    this.loadingObj.noOfMasterload = true;
    if(this.userLevel == 5){
      e = e;
    }else if(this.userLevel == 4){
      e['scDistrictId'] = this.userProfile.district;
      e['scBlockId'] = "";
      console.log(e);
    }else if(this.userLevel == 3){
      e['scDistrictId'] = this.userProfile.district;
      e['scBlockId'] = this.userProfile.block;
      console.log(e);
    }
    this.trainingTypeServices
      .getTeacherCount(e)
      .subscribe((res: any) => {
        if(res.data.length === 0){
          this.CreateTraining.controls["noOfMaster"].patchValue('0');
          this.loadingObj.noOfMasterload = false;
        }else{
          this.totalNoTrainer = res.data[0].teacherCount;
          this.CreateTraining.controls["noOfMaster"].patchValue(
            this.totalNoTrainer
          );
          this.loadingObj.noOfMasterload = false;
        }
        
      });
  }

  // futuredateCheck1(){
  //   let startDate = this.CreateTraining.controls['startDate'].value;
  //   const newDate = new Date();
  //   if(startDate !=='')
  //       if (formatDate(startDate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){

  //         this.alertHelper.viewAlert(
  //           "error",
  //           "Invalid",
  //           "Date of visit must not be above today's date"
  //         );
  //          this.CreateTraining.patchValue({
  //           startDate: ''
  //          });

  //       }
  // }

  // futuredateCheck2(){
  //   let endDate = this.CreateTraining.controls['endDate'].value;
  //   const newDate = new Date();
  //   if(endDate !=='')
  //       if (formatDate(endDate,'yyyy-MM-dd','en_US') < formatDate(newDate,'yyyy-MM-dd','en_US')){

  //         this.alertHelper.viewAlert(
  //           "error",
  //           "Invalid",
  //           "Date of visit must not be above today's date"
  //         );
  //          this.CreateTraining.patchValue({
  //           endDate: ''
  //          });

  //       }
  // }
}
