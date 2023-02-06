import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SchoolService } from "../../services/school.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { IDropdownSettings } from "ng-multiselect-dropdown";
@Component({
  selector: "app-edit-school",
  templateUrl: "./edit-school.component.html",
  styleUrls: ["./edit-school.component.css"],
})
export class EditSchoolComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  encId: string = "";
  schoolForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  anexType: any;
  anextureType: any;
  annexData: any;
  managementName: any = "";
  othermanagementName: any = "";

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
    "Habitation Name / mohalla",
    "PIN Code",
    "Educational block",
    "Name of city",
    "Assembly constituency",
    "Parliamentary constituency",
    "School type",
    "Management",
    "For Management code 101 mention nodal ministry/dept.",
    // "Initialization year of school",
    // "Establishment year of school",
    "Administration Type",
    "School category",
    "Address",
    "Medium of instruction (s) in the school",
    "Language(s) taught as a subject",
    // "State Specific Category",
    "Respondent Type",
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
    "",
    "",
    "",
    "",
    "",
  ];

  posts: any;
  schoolData: any;
  userId: any = "";
  profileId: any = "";
  userProfile: any = [];
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  panchayatData: any = [];
  villageData: any = [];
  schoolTypeData: any = [];
  schoolMgmtData: any = [];
  schoolCatData: any = [];
  chargeTypeData: any = [];
  assemblyData: any = [];
  parliamentaryData: any = [];

  showSpinnerBlock: boolean = false;
  disrtictChanged: boolean = false;
  clusterChanged: boolean = false;
  blockChanged: boolean = false;
  panchayatChanged: boolean = false;
  villageChanged: boolean = false;
  schoolTypeChanged: boolean = false;
  schoolMgmtChanged: boolean = false;
  schoolCatagoryChanged: boolean = false;

  /* Initialize form controls */
  crStatus: string = "";
  verificationStatus: string = "";
  academicYear: string = "";
  schoolName: string = "";
  schoolUdiseCode: string = "";
  schoolUschcdCode: string = "";
  latitude: string = "";
  longitude: string = "";
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  locateId: any = "";
  nagarnigamId: any = "";
  villageId: any = "";
  habitation: string = "";
  pincode: string = "";
  educationBlock: number = 0;
  city: string = "";
  assConstituency: any = "";
  parConstituency: any = "";
  schoolType: any = "";
  management: any = "";
  otherManagement: any = "";
  yearSchoolInitialization: string = "";
  establishYear: string = "";
  //admistrationType: any = "";
  schoolCategory: any = "";
  address: string = "";

  // stateSpecificCatId: any;
  respondentType: string = "";
  respondentName: string = "";
  schoolLandline: string = "";
  respondentMobile: string = "";
  schoolWebsite: string = "";
  schoolEmail: string = "";
  chargeType: string = "";
  headOfSchool: string = "";
  //HMLandline:string = "";
  HMMobile: string = "";
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  mediumOfInstructionsData: any = [];
  languagesTaughtData: any = [];
  selectedItems: any = [];
  selectedValues: any = [];
  mediumOfInstructions: any = "";
  languagesTaught: any = "";
  district: any = "";
  block: any = "";
  locate: any = "";
  loginUserTypeId: any = "";

  distNameCode: any = "";
  blockNameCode: any = "";
  clustNameCode: any = "";
  panNameCode: any = "";
  vlgNameCode: any = "";
  locatedAtName: any = "";
  udCode: any = "";
  schoolCode: any = "";
  schName: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef
  ) {
    const pageUrl: any = this.route.url;
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
    this.loginUserTypeId = this.userProfile?.loginUserTypeId;
    this.encId = this.router.snapshot.params["encId"];
    this.loadAnnexturesDataBySeq();
    this.getAnnextureData();
   
    this.initializeForm();
    this.getDistrict();
    this.getSchoolCategory();
    this.getSchoolManagement();

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
  }

  ngAfterViewInit() {
    if(this.loginUserTypeId!=2){
      this.el.nativeElement.querySelector("[formControlName=schoolName]").focus();
    }else{
      this.el.nativeElement.querySelector("[formControlName=latitude]").focus();
    }
    
  }
  get schoolFormControl() {
    return this.schoolForm.controls;
  }
  editSchool(encId: string) {
    this.spinner.show();
    let paramList = { encId: encId };
    this.schoolService.getSchool(paramList).subscribe((res: any) => {
      this.schoolData = res.data[0];
      this.academicYear = this.schoolData.academicYear;
      this.schoolName = this.schoolData.schoolName;
      this.schoolUdiseCode = this.schoolData.schoolUdiseCode;
      this.schoolUschcdCode = this.schoolData.schoolUschcdCode;
      this.latitude = this.schoolData.latitude;
      this.longitude = this.schoolData.longitude;
      this.districtId = this.schoolData.districtId;
      this.blockId = this.schoolData.blockId;
      this.clusterId = this.schoolData.clusterId;
      this.locateId = this.schoolData.locateId?.toString();
      this.nagarnigamId = this.schoolData.nagarnigamId;
      this.villageId = this.schoolData.villageId;
      this.habitation = this.schoolData.habitation;
      this.pincode = this.schoolData.pincode;
      this.educationBlock = this.schoolData.educationBlock;
      this.city = this.schoolData.city;
      this.assConstituency = this.schoolData.assConstituency;
      this.parConstituency = this.schoolData.parConstituency;
      this.schoolType = this.schoolData.schoolType;
      this.management = this.schoolData.management;
      this.managementName = this.schoolData.management;
      this.otherManagement = this.schoolData.otherManagement;
      //this.admistrationType = this.schoolData.admistrationType;
      this.schoolCategory = this.schoolData.schoolCategory;
      this.address = this.schoolData.address;
      this.respondentType = this.schoolData.respondentType;
      this.respondentName = this.schoolData.respondentName;
      this.schoolLandline = this.schoolData.schoolLandline;
      this.respondentMobile = this.schoolData.respondentMobile;
      this.schoolWebsite = this.schoolData.schoolWebsite;
      this.schoolEmail = this.schoolData.schoolEmail;
      this.chargeType = this.schoolData.chargeType;
      this.headOfSchool = this.schoolData.headOfSchool;
      this.HMMobile = this.schoolData.HMMobile;
      this.encId = this.schoolData.encId;
      this.crStatus = this.schoolData.crStatus;
      this.verificationStatus = this.schoolData.verificationStatus;
      this.distNameCode = this.schoolData.distNameCode;
      this.blockNameCode = this.schoolData.blockNameCode;
      this.clustNameCode = this.schoolData.clustNameCode;
      this.panNameCode = this.schoolData.panNameCode;
      this.vlgNameCode = this.schoolData.vlgNameCode;
      this.locatedAtName = this.schoolData.locatedAtName;
      this.udCode = this.schoolData.schoolUdiseCode;
      this.schoolCode = this.schoolData.schoolUschcdCode;
      this.schName = this.schoolData.schoolName;
      this.mediumOfInstructionsData.forEach((val: any, key: any) => {
        if (this.schoolData.mediumOfInstructions.length > 0) {
          if (
            this.schoolData.mediumOfInstructions.find(
              (x: any) => x == val.anxtValue
            )
          ) {
            this.selectedItems.push({
              anxtValue: val.anxtValue,
              anxtName: val.anxtName,
            });
          }
        }
      });
      console.log(this.selectedItems, ":::selected items for MOI");
      this.languagesTaughtData.forEach((val: any, key: any) => {
        if (this.schoolData.languagesTaught.length != 0) {
          if (
            this.schoolData.languagesTaught.find(
              (x: any) => x == val.anxtValue
            )
          ) {
            this.selectedValues.push({
              anxtValue: val.anxtValue,
              anxtName: val.anxtName,
            });
          }
        }
      });
      console.log(this.selectedValues, ":::selected values for LT");
      this.getBlock(this.districtId);
      this.getCluster(this.blockId);
      //this.locateRadioControl(this.locateId);
      if(this.locateId==1){
        this.getPanchayat(this.blockId);
      }else{
        this.getMunicipality(this.districtId);
      }
      //this.getVillageWard(this.districtId,this.blockId,this.locateId);
      this.resetForm();
      this.spinner.hide();
      
    });
   
  }
  resetForm() {
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
    this.schoolForm.get("mediumOfInstructions")?.patchValue(this.selectedItems);
    this.schoolForm.get("languagesTaught")?.patchValue(this.selectedValues);
    this.schoolForm.get("respondentType")?.patchValue(this.respondentType);
    this.schoolForm.get("respondentName")?.patchValue(this.respondentName);
    this.schoolForm.get("schoolLandline")?.patchValue(this.schoolLandline);
    this.schoolForm.get("respondentMobile")?.patchValue(this.respondentMobile);
    this.schoolForm.get("schoolWebsite")?.patchValue(this.schoolWebsite);
    this.schoolForm.get("schoolEmail")?.patchValue(this.schoolEmail);
    this.schoolForm.get("chargeType")?.patchValue(this.chargeType);
    this.schoolForm.get("headOfSchool")?.patchValue(this.headOfSchool);
    this.schoolForm.get("HMMobile")?.patchValue(this.HMMobile);
    this.schoolForm.get("encId")?.patchValue(this.encId);
    this.schoolForm.get("userId")?.patchValue(this.userId);
    this.schoolForm.get("crStatus")?.patchValue(this.crStatus);
    this.schoolForm.get("verificationStatus")?.patchValue(this.verificationStatus);
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
        [Validators.maxLength(40), this.customValidators.firstCharValidatorRF],
      ],
      assConstituency: [this.assConstituency, [Validators.required]],
      parConstituency: [this.parConstituency,Validators.required],
      schoolType: [this.schoolType, Validators.required],
      management: [this.management, Validators.required],
      otherManagement: [this.otherManagement],
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
      mediumOfInstructions: [this.selectedItems, Validators.required],
      languagesTaught: [this.selectedValues, Validators.required],
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
            "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
          ),
          Validators.maxLength(50),
        ],
      ],
      schoolEmail: [
        this.schoolEmail,
        [Validators.email, Validators.maxLength(50)],
      ],
      chargeType: [this.chargeType],
      headOfSchool: [
        this.headOfSchool,
        [
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          Validators.maxLength(100),
          this.customValidators.firstCharValidatorRF,
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
      encId: [this.encId],
      userId: [this.userId],
      crStatus: [this.crStatus],
      verificationStatus: [this.verificationStatus],
      loginUserTypeId: [this.loginUserTypeId],
      profileId: [this.profileId],
    });
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
     console.log(this.schoolForm.value, "rihan");
    if (this.schoolForm.valid === true) {
      this.alertHelper.updateAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.schoolService.schoolUpdate(this.schoolForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "School information updated successfully.",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewSchool"], {
                    relativeTo: this.router,
                  });
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
  getDistrict() {
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
      }
      this.disrtictChanged = false;
    });
  }
  getBlock(districtId: any) {
    this.getParliamentary();
    this.blockChanged = true;
    this.districtId = districtId;
    this.blockData = [];
    this.clusterData = [];
    this.panchayatData = [];
    this.villageData = [];
    this.assemblyData = [];
    this.parliamentaryData = [];
    if (districtId !== "") {
      this.getAssembly(districtId);
   
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.blockData.push(data["data"][key]);
        }
        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
        }
        this.blockChanged = false;
      });
    } else {
      this.blockChanged = false;
    }
  }
  getCluster(id: any) {
    this.clusterChanged = true;
    this.blockId = id;
    this.clusterData = [];
    this.villageData = [];
    if (id !== "") {
      this.getVillageWard(this.districtId,this.blockId,this.locateId);
      this.commonService.getClusterByBlockId(id).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
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
    this.schoolForm.patchValue({
      villageId: "",
    });
    this.villageData = [];
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
          });
            this.villageChanged = false;
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
  getSchoolCategory() {
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];
    this.schoolService.getSchoolCategory().subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.schoolCatData.push(data["data"][key]);
      }
      //console.log(this.schoolCatData,"test")
    });
    this.schoolCatagoryChanged = false;
  }
  //annexture value call start
  loadAnnexturesDataBySeq() {
    const anxTypes = ["TYPE_OF__SCHOOL", "MEDIUM_OF_INSTRUCTION","LANGUAGE"];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        this.schoolTypeData = res?.data?.TYPE_OF__SCHOOL;
        this.mediumOfInstructionsData = res?.data?.MEDIUM_OF_INSTRUCTION;
        this.languagesTaughtData = res?.data?.LANGUAGE;
        this.editSchool(this.encId);

      },
    });
   
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["RESPONDENT_TYPE", "HOS_INCHARGE_TYPE"])
      .subscribe({
        next: (res: any) => {
          this.spinner.show();

          this.anextureType = res?.data?.RESPONDENT_TYPE.sort(
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
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
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
  cancelForm() {
    this.route.navigate(["../../viewSchool"], {
      relativeTo: this.router,
    });
  }
}
