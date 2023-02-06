import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SchoolService } from "../../services/school.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
  selector: "app-add-school",
  templateUrl: "./add-school.component.html",
  styleUrls: ["./add-school.component.css"],
})
export class AddSchoolComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  userProfile: any = [];
  adminPrivilege: boolean = false;
  schoolForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any = [];
  userId: any = "";
  profileId: any = "";
  schoolType: any = "";
  //admistrationType: any = "";
  mediumOfInstructions: any = "";
  languagesTaught: any = "";
  anexType: any;
  anextureType: any;
  annexData: any;
  managementName: any = "";
  otherManagement: any = "";
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  panchayatData: any = [];
  villageData: any = [];
  schoolTypeData: any = [];
  schoolMgmtData: any = [];
  schoolCatData: any = [];
  respTypeData: any = [];
  chargeTypeData: any = [];
  assemblyData: any = [];
  parliamentaryData: any = [];

  showSpinnerBlock: boolean = false;
  disrtictChanged: boolean = false;
  clusterChanged: boolean = false;
  blockChanged: boolean = false;
  disrtictSelect: boolean = true;
  clusterSelect: boolean = true;
  blockSelect: boolean = true;
  panchayatChanged: boolean = false;
  villageChanged: boolean = false;
  schoolTypeChanged: boolean = false;
  schoolMgmtChanged: boolean = false;
  schoolCatagoryChanged: boolean = false;

  /* Initialize form controls */

  allLabel: string[] = [
    "Academic year",
    "School name",
    "School UDISE code",
    "School code",
    "Latitude",
    "Longitude",
    "District",
    "Block",
    "Cluster",
    "Is this school located in",
    "Panchayat",
    "Village",
    "Habitation name / mohalla",
    "PIN code",
    "Educational block",
    "Name of city",
    "Assembly constituency",
    "Parliamentary constituency",
    "School type",
    "Management",
    "For management code 101 mention nodal ministry/dept.",
    // "Initialization year of school",
    // "Establishment year of school",
    "Administration type",
    "School category",
    "Address",
    "Medium of instruction (s) in the school",
    "Language(s) taught as a subject",
    // "State Specific Category",
    "Respondent type",
    "Respondent name ",
    "Landline number of respondent",
    "Mobile number of respondent",
    "Website of school",
    "Email of school",
    "HoS / In-Charge Type",
    "HoS /In-Charge Name",
    //"Landline number of school head",
    "Mobile number of school head",
    "",
  ];
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  locateId: any = "1";
  nagarnigamId: any = "";
  villageId: any = "";
  schoolName: any = "";
  schoolUdiseCode: any = "";
  schoolUschcdCode: any = "";
  latitude: any = "";
  longitude: any = "";
  habitation: any = "";
  pincode: any = "";
  educationBlock: any = "";
  city: any = "";
  assConstituency: any = "";
  parConstituency: any = "";
  management: any = "";
  address: any = "";
  selectedItems: any = "";
  respondentType: any = "";
  respondentName: any = "";
  schoolLandline: any = "";
  respondentMobile: any = "";
  schoolWebsite: any = "";
  schoolEmail: any = "";
  chargeType: any = "";
  headOfSchool: any = "";
  HMMobile: any = "";
  schoolCategory: any = "";
  district: any = "";
  block: any = "";
  locate: any = "";
 
  mediumOfInstructionsData: any = [];
  languagesTaughtData: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private schoolService: SchoolService,
    private el: ElementRef
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.profileId = this.userProfile?.profileId;
    if (this.userProfile.district != 0 || this.userProfile.district != "") {
      this.districtId = this.userProfile.district;
      this.disrtictSelect = false;
    }
    if (this.userProfile.block != 0 || this.userProfile.block != "") {
      this.blockId = this.userProfile.block;
      this.blockSelect = false;
    }
    if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
      this.clusterId = this.userProfile.cluster;
      this.clusterSelect = false;
    }
    this.initializeForm();
    this.getDistrict();
    this.getSchoolCategory();
    this.getSchoolManagement();
    this.loadAnnexturesDataBySeq();
    this.getAnnextureData();
    this.dropdownSettings = {
      idField: "anxtValue",
      textField: "anxtName",
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
      singleSelection: false,
    };
    this.dropdownSettings1 = {
      idField: "anxtValue",
      textField: "anxtName",
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=schoolName]").focus();
  }
  get schoolFormControl() {
    return this.schoolForm.controls;
  }
  initializeForm() {
    this.schoolForm = this.formBuilder.group({
      academicYear: [this.academicYear, Validators.required],
      schoolName: [
       this.schoolName,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9 ,.()+'\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      schoolUdiseCode: [
        this.schoolUdiseCode,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.maxLength(15),
        ],
      ],
      schoolUschcdCode: [
       this.schoolUschcdCode,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.maxLength(15),
        ],
      ],
      latitude: [
       this.latitude,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern("^[-+]?[0-9]{1,7}(.[0-9]+)?$"),
        ],
      ],
      longitude: [
       this.longitude,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern("^[-+]?[0-9]{1,7}(.[0-9]+)?$"),
        ],
      ],
      districtId: [this.districtId, Validators.required],
      blockId: [this.blockId, Validators.required],
      clusterId: [this.clusterId, Validators.required],
      locateId: [this.locateId, Validators.required],
      nagarnigamId: [this.nagarnigamId],
      villageId: [this.villageId],
      habitation: [
        this.habitation,
        [Validators.maxLength(100), this.customValidators.firstCharValidatorRF],
      ],
      pincode: [
        this.pincode,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.maxLength(6),
        ],
      ],
      educationBlock: [this.educationBlock, Validators.required],
      city: [
        this.city,
        [
          Validators.maxLength(40),
          Validators.pattern(/^[a-zA-Z0-9 ,.()'\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      assConstituency: [this.assConstituency, Validators.required],
      parConstituency: [this.parConstituency, Validators.required],
      schoolType: [this.schoolType, Validators.required],
      management: [this.management, Validators.required],
      otherManagement: [
        this.otherManagement,
        [
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(80),
        ],
      ],
      //admistrationType: [this.admistrationType, Validators.required],
      schoolCategory: [this.schoolCategory, Validators.required],
      address: [
        this.address,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      mediumOfInstructions: [this.mediumOfInstructions, Validators.required],
      languagesTaught: [this.languagesTaught, Validators.required],
      respondentType: [this.respondentType,[ Validators.required]],
      respondentName: [
        this.respondentName,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          Validators.maxLength(100),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      schoolLandline: [
        this.schoolLandline,
        [
          Validators.pattern("^[0-9()-]*$"),
          Validators.min(1),
          Validators.maxLength(15),
        ],
      ],
      respondentMobile: [
        this.respondentMobile,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      schoolWebsite: [
        this.schoolWebsite,
        [
          Validators.pattern(
            /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
          ),
          Validators.maxLength(50),
        ],
      ],
      schoolEmail: [this.schoolEmail, [Validators.email, Validators.maxLength(50)]],
      chargeType: [this.chargeType],
      headOfSchool: [
        this.headOfSchool,
        [
          // Validators.required,
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(100),
        ],
      ],
      HMMobile: [
        this.HMMobile,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.min(1),
        ],
      ],
      sessionValue: [this.userProfile],
      userId: [this.userId],
      profileId: [this.profileId],
    });
  }
  resetForm(){
    this.schoolForm.get("academicYear")?.patchValue(this.academicYear);
    this.schoolForm.get("schoolName")?.patchValue(this.schoolName);
    this.schoolForm.get("schoolUdiseCode")?.patchValue(this.schoolUdiseCode);
    this.schoolForm.get("schoolUschcdCode")?.patchValue(this.schoolUschcdCode);
    this.schoolForm.get("latitude")?.patchValue(this.latitude);
    this.schoolForm.get("longitude")?.patchValue(this.longitude);
    this.schoolForm.get("districtId")?.patchValue(this.districtId);
    this.schoolForm.get("blockId")?.patchValue(this.blockId);
    this.schoolForm.get("clusterId")?.patchValue(this.clusterId);
    this.schoolForm.get("locateId")?.patchValue(this.locateId);
    this.schoolForm.get("nagarnigamId")?.patchValue(this.nagarnigamId);
    this.schoolForm.get("villageId")?.patchValue(this.villageId);
    this.schoolForm.get("habitation")?.patchValue(this.habitation);
    this.schoolForm.get("pincode")?.patchValue(this.pincode);
    this.schoolForm.get("educationBlock")?.patchValue(this.educationBlock);
    this.schoolForm.get("city")?.patchValue(this.city);
    this.schoolForm.get("assConstituency")?.patchValue(this.assConstituency);
    this.schoolForm.get("parConstituency")?.patchValue(this.parConstituency);
    this.schoolForm.get("schoolType")?.patchValue(this.schoolType);
    this.schoolForm.get("management")?.patchValue(this.management);
    this.schoolForm.get("otherManagement")?.patchValue(this.otherManagement);
    //this.schoolForm.get("admistrationType")?.patchValue(this.admistrationType);
    this.schoolForm.get("schoolCategory")?.patchValue(this.schoolCategory);
    this.schoolForm.get("address")?.patchValue(this.address);
    this.schoolForm.get("mediumOfInstructions")?.patchValue(this.mediumOfInstructions);
    this.schoolForm.get("languagesTaught")?.patchValue(this.languagesTaught);
    this.schoolForm.get("respondentType")?.patchValue(this.respondentType);
    this.schoolForm.get("respondentName")?.patchValue(this.respondentName);
    this.schoolForm.get("schoolLandline")?.patchValue(this.schoolLandline);
    this.schoolForm.get("respondentMobile")?.patchValue(this.respondentMobile);
    this.schoolForm.get("schoolWebsite")?.patchValue(this.schoolWebsite);
    this.schoolForm.get("schoolEmail")?.patchValue(this.schoolEmail);
    this.schoolForm.get("chargeType")?.patchValue(this.chargeType);
    this.schoolForm.get("headOfSchool")?.patchValue(this.headOfSchool);
    this.schoolForm.get("HMMobile")?.patchValue(this.HMMobile);
  }
  onSubmit() {
    this.submitted = true;
    if (this.schoolForm.get("management")?.value == 101) {
      if (
        this.schoolForm.controls["otherManagement"]?.value == "" ||
        this.schoolForm.controls["otherManagement"]?.value == 0
      ) {
        this.el.nativeElement
          .querySelector("[formControlName=groupId]")
          .focus();
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Mention nodal ministry/dept is required"
        );
        return;
      }
    }
    if (this.schoolForm.invalid) {
      this.customValidators.formValidationHandler(
        this.schoolForm,
        this.allLabel,
        this.el
      );
    }
    // console.log(this.schoolForm.value,"rihan")
    if (this.schoolForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.schoolService
            .schoolRegistraion(this.schoolForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "School created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.resetForm();
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
    } else {
      for (const control of Object.keys(this.schoolForm.controls)) {
        this.schoolForm.controls[control].markAsTouched();
      }
    }
  }
  getDistrict() {
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.getBlock(this.userProfile.district);
        this.getVillageWard(this.userProfile.district,this.userProfile.block,1);
      }
      this.disrtictChanged = false;
    });
  }
  getBlock(districtId: any) {
    this.blockChanged = true;
    this.districtId = districtId;
    this.blockData = [];
    this.blockId = null;
    this.clusterData = [];
    this.panchayatData = [];
    this.villageData = [];
    this.assemblyData = [];
    this.parliamentaryData = [];
    if (districtId !== "") {
      this.getAssembly(districtId);
      this.getParliamentary();
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
        let data: any = res;
        this.blockId = null;
        for (let key of Object.keys(data["data"])) {
          this.blockData.push(data["data"][key]);
        }
        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.getCluster(this.userProfile.block);
        }
        this.blockChanged = false;
      });
    } else {
      this.blockChanged = false;
    }
    this.blockId = null;
    this.clusterId = "";
    this.villageId = "";
  }
  getCluster(id: any) {
    this.clusterChanged = true;
    this.blockId = id;
    this.clusterData = [];
    this.clusterId = "";
    this.villageData = [];
    this.villageId = "";
    if (id !== "") {
      this.getVillageWard(this.userProfile.district,this.blockId);
      this.commonService.getClusterByBlockId(id).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }
        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((cls: any) => {
            return cls.clusterId == this.userProfile.cluster;
          });
        }
        this.clusterChanged = false;
      });
    } else {
      this.clusterChanged = false;
    }

    if (this.locateId == 1) {
      this.getPanchayat(id);
    } else {
      this.getMunicipality(this.districtId);
    }
  }
  getPanchayat(id: any) {
    this.panchayatChanged = true;
    this.blockId = id;
    this.panchayatData = [];
    if (id !== "") {
      this.commonService.getPanchayatByBlockId(id).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.panchayatData.push(data["data"][key]);
        }
        this.panchayatChanged = false;
      });
    } else {
      this.panchayatChanged = false;
    }
  }
  getMunicipality(districtId: any) {
    this.panchayatChanged = true;
    this.districtId = districtId;
    this.panchayatData = [];
    if (districtId !== "") {
      this.commonService
        .getMunicipalityByDistrictId(districtId)
        .subscribe((res) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.panchayatData.push(data["data"][key]);
          }
          this.panchayatChanged = false;
        });
    } else {
      this.panchayatChanged = false;
    }
  }
  // getVillageWard(panchayatId: any) {
  //   this.villageChanged = true;
  //   this.villageData = [];
  //   this.nagarnigamId = panchayatId;
  //   if (panchayatId !== "") {
  //     if (this.locateId == 1) {
  //       this.commonService
  //         .getVillageByPanchayatId(panchayatId)
  //         .subscribe((res) => {
  //           let data: any = res;
  //           for (let key of Object.keys(data["data"])) {
  //             this.villageData.push(data["data"][key]);
  //           }
  //           this.villageChanged = false;
  //         });
  //     } else if (this.locateId == 2) {
  //       this.commonService
  //         .getWardByMunicipalityId(panchayatId)
  //         .subscribe((res) => {
  //           let data: any = res;
  //           for (let key of Object.keys(data["data"])) {
  //             this.villageData.push(data["data"][key]);
  //           }
  //           this.villageChanged = false;
  //         });
  //     }
  //   } else {
  //     this.villageChanged = false;
  //   }
  // }
   getVillageWard(districtId: any="",blockId:any="",locateId:any="") {
    this.villageChanged = true;
    this.villageData = [];
    this.schoolForm.patchValue({
      villageId: "",
    });
    if(districtId!=''){
      this.district = districtId;
    }else{
      this.district = parseInt(this.schoolForm.getRawValue()?.districtId);
    }
    if(blockId!=""){
      this.block = blockId;
    }else{
      this.block =parseInt(this.schoolForm.getRawValue()?.blockId);
    }
    if(locateId!=""){
      this.locate = locateId;
    }else{
      this.locate = parseInt(this.schoolForm.getRawValue()?.locateId);
    }
    if (this.locate !== "") {
      if (this.locate == 1) {
         this.schoolService
          .getVillageBydistrictBlock(this.locate,this.district,this.block)
          .subscribe((res : any = []) => {
            this.villageData = res.data;
            this.villageChanged = false;
          });
      } else if (this.locate == 2) {
        this.schoolService
          .getWardByDistrict(this.locate,this.district)
          .subscribe((res : any = []) => {
            this.villageData = res.data;
            this.villageChanged = false;
          });
      }
    } else {
      this.villageChanged = false;
    }
  }
  getAssembly(districtId: any) {
    this.schoolService.getAssembly(districtId).subscribe((data: any = []) => {
      this.assemblyData = data;
      this.assemblyData = this.assemblyData.data;
    });
  }
  getParliamentary() {
    this.schoolService
      .getParliamentary()
      .subscribe((data: any = []) => {
        this.parliamentaryData = data;
        this.parliamentaryData = this.parliamentaryData.data;
      });
  }
  getSchoolCategory() {
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];
    this.schoolService.getSchoolCategory().subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.schoolCatData.push(data["data"][key]);
      }
      this.schoolCatagoryChanged = false;
      // console.log(this.schoolCatData,"test")
    });
  }
  //annexture value call start
  loadAnnexturesDataBySeq() {
    const anxTypes = [
      "TYPE_OF__SCHOOL",
      "MEDIUM_OF_INSTRUCTION",
      "LANGUAGE",
    ];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        this.schoolTypeData = res?.data?.TYPE_OF__SCHOOL;
        this.mediumOfInstructionsData = res?.data?.MEDIUM_OF_INSTRUCTION;
        this.languagesTaughtData = res?.data?.LANGUAGE;
      },
    });
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture([
        "RESPONDENT_TYPE",
        "HOS_INCHARGE_TYPE",
      ])
      .subscribe({
        next: (res: any) => {
          this.spinner.show();
          
          this.respTypeData = res?.data?.RESPONDENT_TYPE.sort(
            (a: any, b: any) =>
              a.anxtName.toLowerCase() < b.anxtName.toLowerCase()
                ? -1
                : b.anxtName.toLowerCase() > a.anxtName.toLowerCase()
                ? 1
                : 0
          );
          this.chargeTypeData = res?.data?.HOS_INCHARGE_TYPE.sort(
            (a: any, b: any) =>
              a.anxtName.toLowerCase() < b.anxtName.toLowerCase()
                ? -1
                : b.anxtName.toLowerCase() > a.anxtName.toLowerCase()
                ? 1
                : 0
          );
          this.spinner.hide();
        },
      });
  }
  getSchoolManagement() {
    this.schoolMgmtChanged = true;
    const anxTypes = ["SCHOOL_MANAGEMENT"];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        this.schoolMgmtData = res?.data?.SCHOOL_MANAGEMENT;
      },
    });
    this.schoolMgmtChanged = false;
  }
  managementChange(val: any) {
    this.schoolForm.patchValue({
      otherManagement: "",
    });
    this.managementName = val;
  }

  locateRadioControl(val: any) {
    this.schoolForm.patchValue({
      nagarnigamId: "",
    });
    this.schoolForm.patchValue({
      villageId: "",
    });
    // console.log(val,"locateId")
    this.locateId = val;
    this.villageData = [];
    let dist="";
    let blk="";
    this.getVillageWard(dist,blk,this.locateId);
    if (val == 1) {
      this.getPanchayat(this.blockId);
    } else {
      this.getMunicipality(this.districtId);
     
    }
  }
}
