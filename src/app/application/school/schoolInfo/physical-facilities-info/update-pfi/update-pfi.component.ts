import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { PhysicalFacilitiesInfoService } from "../../../services/physical-facilities-info.service";
import { SchoolService } from "../../../services/school.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: 'app-update-pfi',
  templateUrl: './update-pfi.component.html',
  styleUrls: ['./update-pfi.component.css']
})
export class UpdatePfiComponent implements OnInit {

  physicalFacilitiesInfoForm!: FormGroup;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  /* Initialize form controls */
  encId: any = "";
  schoolId: any = "";
  schoolBuildingStatus: any = "";
  totalNoOfBuilding: any = "";
  puccaBuilding: any = 0;
  PartiallyPuccaBuilding: any = 0;
  kuchchaBuilding: any = 0;
  tent: any = 0;
  dilapidatedBuliding: any = 0;
  buildingUnderConstruction: any = 0;
  typeOfBoundaryWall: any = "";
  classRoomForInstructional: any = "";
  classRoomUnderConstruction: any = "";
  classRoomUnderdilapidated: any = "";
  classForPreprimary: any = "";
  classForSecondary: any = "";
  classForPrimary: any = "";
  classHighersecondary: any = "";
  classUpperprimary: any = "";

  classCurrentlyNotInUse: any = "";
  totClassForInstructional: any = "";

  puccaClassGoodCondition: any = "";
  puccaClassMinorRepair: any = "";
  puccaClassMajorRepair: any = "";
  partiallyPuccaClassGoodCondition: any = "";
  partiallyPuccaClassMinorRepair: any = "";
  partiallyPuccaClassMajorRepair: any = "";
  kuchchaClassGoodCondition: any = "";
  kuchchaClassMinorRepair: any = "";
  kuchchaClassMajorRepair: any = "";
  tentClassGoodCondition: any = "";
  tentClassMinorRepair: any = "";
  tentClassMajorRepair: any = "";
  roomOtherThenClass: any = "";
  // isSeparateRoomForPrincipal: any = "";
  isSchoolHaveToilet: any = "";
  totalToiletForBoysExcludCwsn: any = 0;
  functionalToiletForBoysExcludCwsn: any = 0;
  totalToiletForGirlsExcludCwsn: any = 0;
  functionalToiletForGirlsExcludCwsn: any = 0;
  totalNoOfToiletExcludCwsn: any = 0;
  totalFunctionalToiletExcludCwsn: any = 0;
  totalToiletForBoysOnCwsn: any = 0;
  functionalToiletForBoysOnCwsn: any = 0;
  totalToiletForGirlsOnCwsn: any = 0;
  functionalToiletForGirlsOnCwsn: any = 0;
  totalNoOfToiletOnCwsn: any = 0;
  totalFunctionalToiletOnCwsn: any = 0;
  totalToiletForBoysIncludeCwsn: any = 0;
  functionalToiletForBoysIncludeCwsn: any = 0;
  totalToiletForGirlsIncludeCwsn: any = 0;
  functionalToiletForGirlsIncludeCwsn: any = 0;
  totalNoOfToiletIncludeCwsn: any = 0;
  totalFunctionalToiletIncludeCwsn: any = 0;
  totalUrinalsForBoys: any = 0;
  functionalUrinalsForBoys: any = 0;
  totalUrinalsForGirls: any = 0;
  functionalUrinalsForGirls: any = 0;
  totalNoOfUrinals: any = 0;
  totalFunctionalUrinals: any = 0;
  watterAvailInFunctionalTiletsForBoys: any = "";
  watterAvailInFunctionalTiletsForGirls: any = "";
  watterAvailInFunctionalUrinalsForBoys: any = "";
  watterAvailInFunctionalUrinalsForGirls: any = "";
  isHandWashingAvailAtToilet: any = "";
  isIncineratorAvail: any = "";
  isDrinkingWaterAvail: any = "";

  isHandPumpAvail: any = "";
  isHandPumpFunctional: any = "";
  isProtectedWellAvail: any = "";
  isProtectedWellFunctional: any = "";
  isUnProtectedWellAvail: any = "";
  isUnProtectedWellFunctional: any = "";
  isTapWaterAvail: any = "";
  isTapWaterFunctional: any = "";
  isBottledWaterAvail: any = "";
  isBottledWaterFunctional: any = "";
  isOtherWaterAvail: any = "";
  isOtherWaterFunctional: any = "";

  // totalHandPumpAvail: any = 0;
  // functionalHandPumpAvail: any = 0;
  // totalProtectedWellAvail: any = 0;
  // functionalProtectedWellAvail: any = 0;
  // totalUnProtectedWellAvail: any = 0;
  // functionalUnProtectedWellAvail: any = 0;
  // totalTapWaterAvail: any = 0;
  // functionalTapWaterAvail: any = 0;
  // totalBottledWaterAvail: any = 0;
  // functionalBottledWaterAvail: any = 0;
  // totalotherWaterAvail: any = 0;
  // functionalotherWaterAvail: any = 0;
  isPurifierAvail: any = "";
  isWaterQualityTested: any = "";
  isRainWaterHarvestingAvail: any = "";
  isHandWashingAvail: any = "";
  noOfWashPoints: any = "";
  isElectricityAvail: any = "";
  isSolarPanelAvail: any = "";
  isLibraryAvail: any = "";
  totalBookInLibrary: any = "";
  bookFromGovtPublisherInLibrary: any = "";
  isBookBankAvail: any = "";
  totalBookInBookBank: any = "";
  bookFromGovtPublisherInBookbank: any = "";
  isReadingCornerAvail: any = "";
  totalBookInReadingCorner: any = "";
  isLibrarianAvail: any = "";
  isNewspaperAvail: any = "";
  islandExpansionAvil: any = "";
  isPlaygroundAvail: any = "";
  isAdjoiningPlaygroundAvail: any = "";
  isMedicalCheckupConducted: any = "";
  noOfMedicalCheckupConducted: any = "";

  isHeightParameterAvail: any = "";
  isWeightParameterAvail: any = "";
  isEyesParameterAvail: any = "";
  isDentalParameterAvail: any = "";
  isThroatParameterAvail: any = "";

  isDewormingTabletGiven: any = "";
  isAnnualHealthRecordMaintained: any = "";
  isTharmalScannerAvail: any = "";
  isFirstAidKitAvail: any = "";
  isLifeSavingMedicineAvail: any = "";
  isIronAndFolicTabletsGiven: any = "";
  isRampAvail: any = "";
  isHandRailsForRampAvail: any = "";
  isSpecialEducatorAvail: any = "";
  isKitchenGardenAvail: any = "";
  isEachClassRoomDustbinAvail: any = "";
  isToiletDustbinAvail: any = "";
  isKitchenDustbinAvail: any = "";
  isFurnitureAvail: any = "";
  noOfFurnitureAvail: any = "";
  physicalFacilitiesInfoData: any = "";
  draftStatus: any = 1;
  /* Other Variables */
  highestClass: any = "";
  lowestClass: any = "";
  schoolMgt: any = "";
  toiletDetails: any;
  allErrorMessages: string[] = [];
  submitted = false;
  allLabel: string[] = [
    "",
    "",
    "",
    "Status of the school building",
    "Total number of building blocks of the school",
    "Pucca building",
    "Partially pucca (building with pucca walls and floor without concrete roof)",
    "Kuchcha building",
    "Tent",
    "Dilapidated building",
    "Building under construction",
    "Type of boundary wall",
    "No. of classrooms used for instructional purposes",
    "No. of classrooms under construction",
    "Total classrooms in dilapidated condition",
    "Instructional purposes classroom for preprimary",
    "Instructional purposes classroom for secondary",
    "Instructional purposes classroom for primary",
    "Instructional purposes classroom for higher-secondary",
    "Instructional purposes classroom for upper-primary",

    "Currently not in use",
    "Total number of classrooms used for instructional purposes",

    "Pucca classes in good condition",
    "Pucca classes need minor repair",
    "Pucca classes need major repair",
    "Partially pucca classes in good condition",
    "Partially pucca classes need minor repair",
    "Partially pucca classes need major repair",
    "Kuchcha classes in good condition",
    "Kuchcha classes need minor repair",
    "Kuchcha classes need major repair",
    "Tent classes in good condition",
    "Tent classes need minor repair",
    "Tent classes need major repair",
    // "Whether separate room for head teacher / principal available",
    "Total number of rooms other than classrooms available in the school",
    "Does the school have toilet",
    "Total number of toilet seats available excluding CWSN friendly toilets for boys",
    "Functional number of toilet seats available excluding CWSN friendly toilets for boys",
    "Total number of toilet seats available excluding CWSN friendly toilets for girls",
    "Functional number of toilet seats available excluding CWSN friendly toilets for girls",
    "Total number of toilet seats available excluding CWSN friendly toilets",
    "Functional number of toilet seats available excluding CWSN friendly toilets",
    "Total number of CWSN friendly toilet seats for boys",
    "Functional number of CWSN friendly toilet seats for boys",
    "Total number of CWSN friendly toilet seats for girls",
    "Functional number of CWSN friendly toilet seats for girls",
    "Total number of CWSN friendly toilet seats ",
    "Functional number of CWSN friendly toilet seats ",
    //=========================
    "",
    "",
    "",
    "",
    "Total toilet seats including CWSN friendly toilets",
    "Functional  toilet seats including CWSN friendly toilets",
    //==================
    "Total number of urinals available for boys",
    "Functional number of urinals available for boys",
    "Total number of urinals available for girls",
    "Functional number of urinals available for girls",
    "Total number of urinals available ",
    "Functional number of urinals available ",
    "Out of the total number of functional toilets, how many have running water available in the toilet for flushing and cleaning for boys",
    "Out of the total number of functional toilets, how many have running water available in the toilet for flushing and cleaning for girls",
    "Out of the total number of functional urinals, how many have running water available in the urinal for flushing and cleaning for boys",
    "Out of the total number of functional urinals, how many have running water available in the urinal for flushing and cleaning for girls",

    "Is hand washing facility with soap available near toilets/urinals block",
    "Whether incinerator is available in/ attached to girls toilet",
    "Whether drinking water is available in the school premises?",
    // "Total number of hand pumps available ",
    // "Functional number of hand pumps available",
    // "Total number of protected well available ",
    // "Functional number of protected well available",
    // "Total number of unprotected well available ",
    // "Functional number of unprotected well available",
    // "Total number of tap water available ",
    // "Functional number of tap water available",
    // "Total number of packaged/Bottled water available ",
    // "Functional number of packaged/bottled water available",
    // "Total number of others water sourse available ",
    // "Functional number of others water sourse available",

    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",

    "Whether water purifier/rO is available in the school",
    "Whether water quality is tested from water testing lab",
    "Does the school have provision for rain water harvesting",
    "Whether hand washing facility with soap available for washing hands before and after meal",
    "Number of wash points",
    "Whether electricity connection is available in the school",
    "Whether solar panel is available in school",
    "Library",
    "Total numbers of books for library",
    "Total number of books from NCERT,NBT or any other government publisher for library",
    "Book bank",
    "Total numbers of books for book bank",
    "Total number of books from NCERT,NBT or any other government publisher for book bank",
    "Reading corner",
    "Total numbers of books for reading corner",
    "Does the school have a full-time librarian",
    "Does the school subscribe to newspapers/magazines",
    "Whether land is available for expansion of school facilities",
    "Whether playground facility is available",
    "",
    "Whether medical check-up of students was conducted in last academic year",
    "Total number of medical check-ups conducted in the school during last academic year",

    "",
    "",
    "",
    "",
    "",

    "De-worming tablets given to children",
    "Whether school maintains annual health records",
    "Is thermal scanner available in the school",
    "Is first aid facility available",
    "Is life saving/essential medicines available",
    "Iron and folic acid tablets given to children as per guidelines of WCD",
    "Whether ramp for disabled children to access school building exists",
    "Whether hand-rails for ramp is available",
    "Whether school has special educator",
    "Whether kitchen garden is available in school",
    "Dustbins available In each class room",
    "Dustbins available In toilet",
    "Dustbins available In kitchen",
    "Does the school have furniture for students",
    "No. of students for whom furniture is available",
    "",
    "",
  ];
  anexType: any = "";
  schoolBuildingStatusData: any = "";
  typeOfBoundaryWallData: any = "";
  userProfile: any = [];
  userId:any="";
  constructor(
    private router: ActivatedRoute,
    public route: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private physicalFacilitiesInfoService: PhysicalFacilitiesInfoService,
    private el: ElementRef,
    private schoolService: SchoolService,
    public commonFunctionHelper: CommonFunctionHelper,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.encId = this.router.snapshot.params["encId"];
    this.getMaxAndMinClassAndMgmt(this.encId, this.academicYear);
    // anexture data for schoolBuildingStatus
    this.anexType = "STATUS_OF_SCHOOL_BUILDING";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        //console.log(data);
        this.schoolBuildingStatusData = data;
        this.schoolBuildingStatusData = this.schoolBuildingStatusData.data;
      });
    // anexture data for typeOfBoundaryWall
    this.anexType = "TYPE_OF_BOUNDARY_WALL";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.typeOfBoundaryWallData = data;
        this.typeOfBoundaryWallData = this.typeOfBoundaryWallData.data;
      });
    this.editPhysicalFacilitiesInfo(this.encId, this.academicYear);
    this.spinner.hide();
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=schoolBuildingStatus]").focus();
  }
  getMaxAndMinClassAndMgmt(encId: any, academicYear: any) {
    this.schoolService
      .getMaxAndMinClassAndMgmt(encId, academicYear)
      .subscribe((res:any) => {
        this.highestClass = res.data?.maxClass;
        this.lowestClass =res.data?.minClass;
        this.schoolMgt=res.data?.management;
      });
  }
  initializeForm() {
    //console.log(this.encId);
    this.physicalFacilitiesInfoForm = this.formBuilder.group({
      encId: [this.encId],
      academicYear: [this.academicYear],
      schoolId: [this.schoolId],
      schoolBuildingStatus: [this.schoolBuildingStatus, Validators.required],
      totalNoOfBuilding: [
        this.totalNoOfBuilding,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      puccaBuilding: [
        this.puccaBuilding,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      PartiallyPuccaBuilding: [
        this.PartiallyPuccaBuilding,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      kuchchaBuilding: [
        this.kuchchaBuilding,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      tent: [
        this.tent,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      dilapidatedBuliding: [
        this.dilapidatedBuliding,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      buildingUnderConstruction: [
        this.buildingUnderConstruction,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      typeOfBoundaryWall: [this.typeOfBoundaryWall, Validators.required],
      classRoomForInstructional: [
        this.classRoomForInstructional,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      classRoomUnderConstruction: [
        this.classRoomUnderConstruction,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      classRoomUnderdilapidated: [
        this.classRoomUnderdilapidated,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      classForPreprimary: [
        this.classForPreprimary,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      classForSecondary: [
        this.classForSecondary,
        [
          
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      classForPrimary: [
        this.classForPrimary,
        [
         
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      classHighersecondary: [
        this.classHighersecondary,
        [
        
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      classUpperprimary: [
        this.classUpperprimary,
        [
        
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      classCurrentlyNotInUse: [
        this.classCurrentlyNotInUse,
        [
          
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      totClassForInstructional: [
        this.totClassForInstructional,
        [
         
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      puccaClassGoodCondition: [
        this.puccaClassGoodCondition,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      puccaClassMinorRepair: [
        this.puccaClassMinorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      puccaClassMajorRepair: [
        this.puccaClassMajorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      partiallyPuccaClassGoodCondition: [
        this.partiallyPuccaClassGoodCondition,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      partiallyPuccaClassMinorRepair: [
        this.partiallyPuccaClassMinorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      partiallyPuccaClassMajorRepair: [
        this.partiallyPuccaClassMajorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      kuchchaClassGoodCondition: [
        this.kuchchaClassGoodCondition,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      kuchchaClassMinorRepair: [
        this.kuchchaClassMinorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      kuchchaClassMajorRepair: [
        this.kuchchaClassMajorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      tentClassGoodCondition: [
        this.tentClassGoodCondition,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      tentClassMinorRepair: [
        this.tentClassMinorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      tentClassMajorRepair: [
        this.tentClassMajorRepair,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      roomOtherThenClass: [
        this.roomOtherThenClass,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],

      // isSeparateRoomForPrincipal: [
      //   this.isSeparateRoomForPrincipal,
      //   Validators.required,
      // ],
      isSchoolHaveToilet: [this.isSchoolHaveToilet, Validators.required],
      totalToiletForBoysExcludCwsn: [
        this.totalToiletForBoysExcludCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      functionalToiletForBoysExcludCwsn: [
        this.functionalToiletForBoysExcludCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalToiletForGirlsExcludCwsn: [
        this.totalToiletForGirlsExcludCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      functionalToiletForGirlsExcludCwsn: [
        this.functionalToiletForGirlsExcludCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOfToiletExcludCwsn: [this.totalNoOfToiletExcludCwsn],
      totalFunctionalToiletExcludCwsn: [this.totalFunctionalToiletExcludCwsn],
      totalToiletForBoysOnCwsn: [this.totalToiletForBoysOnCwsn],
      functionalToiletForBoysOnCwsn: [this.functionalToiletForBoysOnCwsn],
      totalToiletForGirlsOnCwsn: [
        this.totalToiletForGirlsOnCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      functionalToiletForGirlsOnCwsn: [
        this.functionalToiletForGirlsOnCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOfToiletOnCwsn: [
        this.totalNoOfToiletOnCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalFunctionalToiletOnCwsn: [
        this.totalFunctionalToiletOnCwsn,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      //==============
      totalToiletForBoysIncludeCwsn: [this.totalToiletForBoysIncludeCwsn],
      functionalToiletForBoysIncludeCwsn: [
        this.functionalToiletForBoysIncludeCwsn,
      ],
      totalToiletForGirlsIncludeCwsn: [this.totalToiletForGirlsIncludeCwsn],
      functionalToiletForGirlsIncludeCwsn: [
        this.functionalToiletForGirlsIncludeCwsn,
      ],
      totalNoOfToiletIncludeCwsn: [this.totalNoOfToiletIncludeCwsn],
      totalFunctionalToiletIncludeCwsn: [this.totalFunctionalToiletIncludeCwsn],
      //============
      totalUrinalsForBoys: [
        this.totalUrinalsForBoys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      functionalUrinalsForBoys: [
        this.functionalUrinalsForBoys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalUrinalsForGirls: [
        this.totalUrinalsForGirls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      functionalUrinalsForGirls: [
        this.functionalUrinalsForGirls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOfUrinals: [this.totalNoOfUrinals],
      totalFunctionalUrinals: [this.totalFunctionalUrinals],
      watterAvailInFunctionalTiletsForBoys: [
        this.watterAvailInFunctionalTiletsForBoys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      watterAvailInFunctionalTiletsForGirls: [
        this.watterAvailInFunctionalTiletsForGirls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      watterAvailInFunctionalUrinalsForBoys: [
        this.watterAvailInFunctionalUrinalsForBoys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      watterAvailInFunctionalUrinalsForGirls: [
        this.watterAvailInFunctionalUrinalsForGirls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isHandWashingAvailAtToilet: [this.isHandWashingAvailAtToilet],
      isIncineratorAvail: [this.isIncineratorAvail],
      isDrinkingWaterAvail: [this.isDrinkingWaterAvail, Validators.required],

      isHandPumpAvail: [this.isHandPumpAvail],
      isHandPumpFunctional: [this.isHandPumpFunctional],
      isProtectedWellAvail: [this.isProtectedWellAvail],
      isProtectedWellFunctional: [this.isProtectedWellFunctional],
      isUnProtectedWellAvail: [this.isUnProtectedWellAvail],
      isUnProtectedWellFunctional: [this.isUnProtectedWellFunctional],
      isTapWaterAvail: [this.isTapWaterAvail],
      isTapWaterFunctional: [this.isTapWaterFunctional],
      isBottledWaterAvail: [this.isBottledWaterAvail],
      isBottledWaterFunctional: [this.isBottledWaterFunctional],
      isOtherWaterAvail: [this.isOtherWaterAvail],
      isOtherWaterFunctional: [this.isOtherWaterFunctional],

      // totalHandPumpAvail: [
      //   this.totalHandPumpAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalHandPumpAvail: [
      //   this.functionalHandPumpAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // totalProtectedWellAvail: [
      //   this.totalProtectedWellAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalProtectedWellAvail: [
      //   this.functionalProtectedWellAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // totalUnProtectedWellAvail: [
      //   this.totalUnProtectedWellAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalUnProtectedWellAvail: [
      //   this.functionalUnProtectedWellAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // totalTapWaterAvail: [
      //   this.totalTapWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalTapWaterAvail: [
      //   this.functionalTapWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // totalBottledWaterAvail: [
      //   this.totalBottledWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalBottledWaterAvail: [
      //   this.functionalBottledWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // totalotherWaterAvail: [
      //   this.totalotherWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      // functionalotherWaterAvail: [
      //   this.functionalotherWaterAvail,
      //   [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      // ],
      isPurifierAvail: [this.isPurifierAvail, Validators.required],
      isWaterQualityTested: [this.isWaterQualityTested, Validators.required],
      isRainWaterHarvestingAvail: [
        this.isRainWaterHarvestingAvail,
        Validators.required,
      ],
      isHandWashingAvail: [this.isHandWashingAvail, Validators.required],
      noOfWashPoints: [
        this.noOfWashPoints,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isElectricityAvail: [this.isElectricityAvail, Validators.required],
      isSolarPanelAvail: [this.isSolarPanelAvail, Validators.required],
      isLibraryAvail: [this.isLibraryAvail],
      totalBookInLibrary: [
        this.totalBookInLibrary,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      bookFromGovtPublisherInLibrary: [
        this.bookFromGovtPublisherInLibrary,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isBookBankAvail: [this.isBookBankAvail],
      totalBookInBookBank: [
        this.totalBookInBookBank,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      bookFromGovtPublisherInBookbank: [
        this.bookFromGovtPublisherInBookbank,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isReadingCornerAvail: [this.isReadingCornerAvail],
      totalBookInReadingCorner: [
        this.totalBookInReadingCorner,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isLibrarianAvail: [this.isLibrarianAvail, Validators.required],
      isNewspaperAvail: [this.isNewspaperAvail, Validators.required],
      islandExpansionAvil: [this.islandExpansionAvil, Validators.required],
      isPlaygroundAvail: [this.isPlaygroundAvail, Validators.required],
      isAdjoiningPlaygroundAvail: [this.isAdjoiningPlaygroundAvail],
      isMedicalCheckupConducted: [
        this.isMedicalCheckupConducted,
        Validators.required,
      ],
      noOfMedicalCheckupConducted: [
        this.noOfMedicalCheckupConducted,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      isHeightParameterAvail: [this.isHeightParameterAvail],
      isWeightParameterAvail: [this.isWeightParameterAvail],
      isEyesParameterAvail: [this.isEyesParameterAvail],
      isDentalParameterAvail: [this.isDentalParameterAvail],
      isThroatParameterAvail: [this.isThroatParameterAvail],

      isDewormingTabletGiven: [
        this.isDewormingTabletGiven,
        Validators.required,
      ],
      isAnnualHealthRecordMaintained: [
        this.isAnnualHealthRecordMaintained,
        Validators.required,
      ],
      isTharmalScannerAvail: [this.isTharmalScannerAvail, Validators.required],
      isFirstAidKitAvail: [this.isFirstAidKitAvail, Validators.required],
      isLifeSavingMedicineAvail: [
        this.isLifeSavingMedicineAvail,
        Validators.required,
      ],
      isIronAndFolicTabletsGiven: [
        this.isIronAndFolicTabletsGiven,
        Validators.required,
      ],
      isRampAvail: [this.isRampAvail, Validators.required],
      isHandRailsForRampAvail: [
        this.isHandRailsForRampAvail,
        Validators.required,
      ],
      isSpecialEducatorAvail: [
        this.isSpecialEducatorAvail,
        Validators.required,
      ],
      isKitchenGardenAvail: [this.isKitchenGardenAvail, Validators.required],
      isEachClassRoomDustbinAvail: [
        this.isEachClassRoomDustbinAvail,
        Validators.required,
      ],
      isToiletDustbinAvail: [this.isToiletDustbinAvail, Validators.required],
      isKitchenDustbinAvail: [this.isKitchenDustbinAvail, Validators.required],
      isFurnitureAvail: [this.isFurnitureAvail, Validators.required],
      noOfFurnitureAvail: [
        this.noOfFurnitureAvail,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)],
      ],
      draftStatus: [this.draftStatus],
      userId: [this.userId],
    });
  }
  //THE BELOW FUNCTION ARE FOR SHOW AND HIDE ACCORDING TO CONDITION-------START
  schoolHavetoilet(val: any) {
    this.isSchoolHaveToilet = val;
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForBoysExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForBoysExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForGirlsExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForGirlsExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForBoysOnCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForBoysOnCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForGirlsOnCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForGirlsOnCwsn: 0
    });

    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletExcludCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletOnCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletOnCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForBoysIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForBoysIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalToiletForGirlsIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalToiletForGirlsIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletIncludeCwsn: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalUrinalsForBoys: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalUrinalsForBoys: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalUrinalsForGirls: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      functionalUrinalsForGirls: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfUrinals: 0
    });
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalUrinals: 0
    });

    this.physicalFacilitiesInfoForm.patchValue({
      watterAvailInFunctionalTiletsForBoys: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      watterAvailInFunctionalTiletsForGirls: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      watterAvailInFunctionalUrinalsForBoys: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      watterAvailInFunctionalUrinalsForGirls: ""
    });
  }
  drinkingWaterAvail(val: any) {
    this.isDrinkingWaterAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      isHandPumpAvail: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      isProtectedWellAvail: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      isUnProtectedWellAvail: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      isTapWaterAvail: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      isBottledWaterAvail: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      isOtherWaterAvail: ""
    });
  }
  libraryAvail(val: any) {
    this.isLibraryAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      totalBookInLibrary: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      bookFromGovtPublisherInLibrary: ""
    });
    
  }
  bookBankAvail(val: any) {
    this.isBookBankAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      totalBookInBookBank: ""
    });
    this.physicalFacilitiesInfoForm.patchValue({
      bookFromGovtPublisherInBookbank: ""
    });
  }
  readingCornerAvail(val: any) {
    this.isReadingCornerAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      totalBookInReadingCorner: ""
    });
  }
  playGroundAvail(val: any) {
    this.isPlaygroundAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      isAdjoiningPlaygroundAvail: ""
    });
  }
  medicakCheckup(val: any) {
    this.isMedicalCheckupConducted = val;
    this.physicalFacilitiesInfoForm.patchValue({
      noOfMedicalCheckupConducted: ""
    });
  }
  furnitureAvail(val: any) {
    this.isFurnitureAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      noOfFurnitureAvail: ""
    });
  }
  handWashingAvail(val: any) {
    this.isHandWashingAvail = val;
    this.physicalFacilitiesInfoForm.patchValue({
      noOfWashPoints: ""
    });
  }
  handPumpAvail(val: any) {
    this.isHandPumpAvail = val;
    // this.isHandPumpFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isHandPumpFunctional: ""
    });
  }
  protectedWellAvail(val: any) {
    this.isProtectedWellAvail = val;
    // this.isProtectedWellFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isProtectedWellFunctional: ""
    });
  }
  unprotectedWellAvail(val: any) {
    this.isUnProtectedWellAvail = val;
    // this.isUnProtectedWellFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isUnProtectedWellFunctional: ""
    });
  }
  tapWaterAvail(val: any) {
    this.isTapWaterAvail = val;
    // this.isTapWaterFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isTapWaterFunctional: ""
    });
  }
  bottleWaterAvail(val: any) {
    this.isBottledWaterAvail = val;
    // this.isBottledWaterFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isBottledWaterFunctional: ""
    });
  }
  otherWaterAvail(val: any) {
    this.isOtherWaterAvail = val;
    // this.isOtherWaterFunctional = "";
    this.physicalFacilitiesInfoForm.patchValue({
      isOtherWaterFunctional: ""
    });
  }

  //THE BELOW FUNCTION ARE FOR SHOW AND HIDE ACCORDING TO CONDITION-------END
  noOfWorkingUnitFromFunctionalUnit(
    totalItem: any,
    functionalItem: any,
    errorType: any
  ) {
    if (
      totalItem.value !== "" &&
      functionalItem.value !== "" &&
      parseInt(functionalItem.value) > parseInt(totalItem.value)
    ) {
      if (errorType == 1) {
        this.alertHelper.viewAlert("error","Invalid","Water available in the toilet for flushing and cleaning can't be greater than total number of functional toilet for boys")
          .then((res: any) => {
            functionalItem.focus();
          });
      } else if (errorType == 2) {
        this.alertHelper.viewAlert("error","Invalid","Water available in the toilet for flushing and cleaning can't be greater than total number of functional toilet for girls")
          .then((res: any) => {
            functionalItem.focus();
          });
      } else if (errorType == 3) {
        this.alertHelper.viewAlert("error","Invalid","Water available in the toilet for flushing and cleaning can't be greater than total number of functional urinals for boys")
          .then((res: any) => {
            functionalItem.focus();
          });
      } else {
        this.alertHelper.viewAlert("error","Invalid","Water available in the toilet for flushing and cleaning can't be greater than total number of functional urinals for girls")
          .then((res: any) => {
            functionalItem.focus();
          });
      }
    }
  }
  //CALCULATION OF TOILETS AND VALIDATIONS START
  // ******************************************
  totalNoOfToiletExcludingCWSN(
    totalToiletForBoysExcludCwsn: any,
    totalToiletForGirlsExcludCwsn: any
  ) {
    if (totalToiletForBoysExcludCwsn.value == "") {
      totalToiletForBoysExcludCwsn.value = 0;
    }
    if (totalToiletForGirlsExcludCwsn.value == "") {
      totalToiletForGirlsExcludCwsn.value = 0;
    }
    let total: string | number =
      parseInt(totalToiletForBoysExcludCwsn?.value) +
      parseInt(totalToiletForGirlsExcludCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletExcludCwsn: total,
    });
  }
  totalFunctionalToiletExcludingCWSN(
    functionalToiletForGirlsExcludCwsn: any,
    functionalToiletForBoysExcludCwsn: any,
    totalToiletForBoysExcludCwsn: any
  ) {
    if (
      functionalToiletForBoysExcludCwsn.value !== "" &&
      totalToiletForBoysExcludCwsn.value == ""
    ) {
        this.alertHelper.viewAlert("error","Invalid","Total No Of unit Are required")

        .then((res: any) => {
          totalToiletForBoysExcludCwsn.focus();
        });
    } else if (
      functionalToiletForBoysExcludCwsn.value !== "" &&
      parseInt(functionalToiletForBoysExcludCwsn.value) >
        parseInt(totalToiletForBoysExcludCwsn.value)
    ) {
      this.alertHelper.viewAlert("error","Invalid","Functional unit can't be greater than total unit")
        .then((res: any) => {
          functionalToiletForBoysExcludCwsn.focus();
        });
    } else if (functionalToiletForGirlsExcludCwsn.value == "") {
      functionalToiletForGirlsExcludCwsn.value = 0;
    } else if (functionalToiletForBoysExcludCwsn.value == "") {
      functionalToiletForBoysExcludCwsn.value = 0;
    }
    let total: string | number =
      parseInt(functionalToiletForGirlsExcludCwsn?.value) +
      parseInt(functionalToiletForBoysExcludCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletExcludCwsn: total,
    });
  }
  // *******************************************
  // ================================================
  totalNoOfToiletOnCWSN(
    totalToiletForBoysOnCwsn: any,
    totalToiletForGirlsOnCwsn: any
  ) {
    if (totalToiletForBoysOnCwsn.value == "") {
      totalToiletForBoysOnCwsn.value = 0;
    }
    if (totalToiletForGirlsOnCwsn.value == "") {
      totalToiletForGirlsOnCwsn.value = 0;
    }
    let total: string | number =
      parseInt(totalToiletForBoysOnCwsn?.value) +
      parseInt(totalToiletForGirlsOnCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletOnCwsn: total,
    });
  }
  totalFunctionalToiletOnCWSN(
    functionalToiletForGirlsOnCwsn: any,
    functionalToiletForBoysOnCwsn: any,
    totalToiletForBoysOnCwsn: any
  ) {
    if (
      functionalToiletForBoysOnCwsn.value !== "" &&
      totalToiletForBoysOnCwsn.value == ""
    ) {
      this.alertHelper.viewAlert("error","Invalid","Total no of unit Are required")
        .then((res: any) => {
          totalToiletForBoysOnCwsn.focus();
        });
    } else if (
      functionalToiletForBoysOnCwsn.value !== "" &&
      parseInt(functionalToiletForBoysOnCwsn.value) >
        parseInt(totalToiletForBoysOnCwsn.value)
    ) {
      this.alertHelper.viewAlert("error","Invalid","Functional unit can't be greater than total unit")
        .then((res: any) => {
          functionalToiletForBoysOnCwsn.focus();
        });
    } else if (functionalToiletForGirlsOnCwsn.value == "") {
      functionalToiletForGirlsOnCwsn.value = 0;
    } else if (functionalToiletForBoysOnCwsn.value == "") {
      functionalToiletForBoysOnCwsn.value = 0;
    }
    let total: string | number =
      parseInt(functionalToiletForGirlsOnCwsn?.value) +
      parseInt(functionalToiletForBoysOnCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletOnCwsn: total,
    });
  }
  // ===============================================
  // ++++++++++++++++++++++++++++++++++++++111111111111
  totalToiletIncludingCWSNForBoys(
    totalToiletForBoysExcludCwsn: any,
    totalToiletForBoysOnCwsn: any,
    totalToiletForBoysIncludeCwsn: any,
    totalToiletForGirlsIncludeCwsn: any
  ) {
    if (totalToiletForBoysExcludCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForBoysIncludeCwsn: parseInt(
          totalToiletForBoysOnCwsn?.value
        ),
      });
    } else if (totalToiletForBoysOnCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForBoysIncludeCwsn: parseInt(
          totalToiletForBoysExcludCwsn?.value
        ),
      });
    } else {
      let total: string | number =
        parseInt(totalToiletForBoysExcludCwsn?.value) +
        parseInt(totalToiletForBoysOnCwsn?.value);
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForBoysIncludeCwsn: total,
      });
    }
    if (totalToiletForGirlsIncludeCwsn.value == "") {
      totalToiletForGirlsIncludeCwsn.value = 0;
    }
    let grandTotal: string | number =
      parseInt(totalToiletForBoysIncludeCwsn?.value) +
      parseInt(totalToiletForGirlsIncludeCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletIncludeCwsn: grandTotal,
    });
  }
  totalToiletIncludingCWSNForGirls(
    totalToiletForGirlsExcludCwsn: any,
    totalToiletForGirlsOnCwsn: any,
    totalToiletForBoysIncludeCwsn: any,
    totalToiletForGirlsIncludeCwsn: any
  ) {
    if (totalToiletForGirlsExcludCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForGirlsIncludeCwsn: parseInt(
          totalToiletForGirlsOnCwsn?.value
        ),
      });
    } else if (totalToiletForGirlsOnCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForGirlsIncludeCwsn: parseInt(
          totalToiletForGirlsExcludCwsn?.value
        ),
      });
    } else {
      let total: string | number =
        parseInt(totalToiletForGirlsExcludCwsn?.value) +
        parseInt(totalToiletForGirlsOnCwsn?.value);
      this.physicalFacilitiesInfoForm.patchValue({
        totalToiletForGirlsIncludeCwsn: total,
      });
    }
    if (totalToiletForBoysIncludeCwsn.value == "") {
      totalToiletForBoysIncludeCwsn.value = 0;
    }
    let grandTotal: string | number =
      parseInt(totalToiletForBoysIncludeCwsn?.value) +
      parseInt(totalToiletForGirlsIncludeCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfToiletIncludeCwsn: grandTotal,
    });
  }
  // +++++++++++++++++++++++++++22222222
  functionalToiletIncludingCWSNForBoys(
    functionalToiletForBoysExcludCwsn: any,
    functionalToiletForBoysOnCwsn: any,
    functionalToiletForBoysIncludeCwsn: any,
    functionalToiletForGirlsIncludeCwsn: any
  ) {
    if (functionalToiletForBoysExcludCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        functionalToiletForBoysIncludeCwsn: parseInt(
          functionalToiletForBoysOnCwsn?.value
        ),
      });
    } else if (functionalToiletForBoysOnCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({
        functionalToiletForBoysIncludeCwsn: parseInt(
          functionalToiletForBoysExcludCwsn?.value
        ),
      });
    } else {
      let total: string | number =
        parseInt(functionalToiletForBoysExcludCwsn?.value) +
        parseInt(functionalToiletForBoysOnCwsn?.value);
      this.physicalFacilitiesInfoForm.patchValue({
        functionalToiletForBoysIncludeCwsn: total,
      });
    }
    if (functionalToiletForGirlsIncludeCwsn.value == "") {
      functionalToiletForGirlsIncludeCwsn.value = 0;
    }
    let grandTotal: string | number =
      parseInt(functionalToiletForBoysIncludeCwsn?.value) +
      parseInt(functionalToiletForGirlsIncludeCwsn?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletIncludeCwsn: grandTotal,
    });
  }
  functionalToiletIncludingCWSNForGirls(
    functionalToiletForGirlsExcludCwsn: any,
    functionalToiletForGirlsOnCwsn: any,
    functionalToiletForBoysIncludeCwsn: any,
    functionalToiletForGirlsIncludeCwsn: any
  ) {
    if (functionalToiletForGirlsExcludCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({functionalToiletForGirlsIncludeCwsn: parseInt(functionalToiletForGirlsOnCwsn?.value),});
    } else if (functionalToiletForGirlsOnCwsn.value == "") {
      this.physicalFacilitiesInfoForm.patchValue({functionalToiletForGirlsIncludeCwsn: parseInt(functionalToiletForGirlsExcludCwsn?.value),});
    } else {
      let funTotForGirlsExCwsn=  parseInt(functionalToiletForGirlsExcludCwsn?.value)?  parseInt(functionalToiletForGirlsExcludCwsn?.value) : 0; 
      let funTotForGirlsOnCwsn=  parseInt(functionalToiletForGirlsOnCwsn?.value) ?   parseInt(functionalToiletForGirlsOnCwsn?.value): 0; 
      let total: string | number =funTotForGirlsExCwsn+ funTotForGirlsOnCwsn;
      this.physicalFacilitiesInfoForm.patchValue({
          functionalToiletForGirlsIncludeCwsn: total,
      });
    }
    // if (functionalToiletForBoysIncludeCwsn.value == "") {
    //   functionalToiletForBoysIncludeCwsn.value = 0;
    // }
    let funTotForBoysInCwsn= parseInt(functionalToiletForBoysIncludeCwsn.value)?  parseInt(functionalToiletForBoysIncludeCwsn.value) : 0;
    let funTotForGirlsInCwsn= parseInt(functionalToiletForGirlsIncludeCwsn.value)?  parseInt(functionalToiletForGirlsIncludeCwsn.value) : 0;
    // let grandTotal: string | number =
    //   parseInt(functionalToiletForBoysIncludeCwsn?.value) +
    //   parseInt(functionalToiletForGirlsIncludeCwsn?.value);
     let grandTotal: string | number =funTotForGirlsInCwsn+funTotForBoysInCwsn;
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalToiletIncludeCwsn: grandTotal,
    });
  }
  //CALCULATION OF URINALS AND VALIDATIONS START
  totalNoOfurinals(totalUrinalsForBoys: any, totalUrinalsForGirls: any) {
    if (totalUrinalsForBoys.value == "") {
      totalUrinalsForBoys.value = 0;
    }
    if (totalUrinalsForGirls.value == "") {
      totalUrinalsForGirls.value = 0;
    }
    let total: string | number =
      parseInt(totalUrinalsForBoys?.value) +
      parseInt(totalUrinalsForGirls?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfUrinals: total,
    });
  }
  totalFunctionalurinal(
    functionalUrinalsForBoys: any,
    functionalUrinalsForGirls: any,
    totalUrinalsForGirls: any
  ) {
    if (
      functionalUrinalsForGirls.value !== "" &&
      totalUrinalsForGirls.value == ""
    ) {
      
      this.alertHelper.viewAlert("error","Invalid","Total number of urinals are  required")
        .then((res: any) => {
          totalUrinalsForGirls.focus();
        });
    } else if (
      functionalUrinalsForGirls.value !== "" &&
      parseInt(functionalUrinalsForGirls.value) >
        parseInt(totalUrinalsForGirls.value)
    ) {
      this.alertHelper.viewAlert("error","Invalid","Functional urinals can't be greater than total urinals")
        .then((res: any) => {
          functionalUrinalsForGirls.focus();
        });
    } else if (functionalUrinalsForBoys.value == "") {
      functionalUrinalsForBoys.value = 0;
    } else if (functionalUrinalsForGirls.value == "") {
      functionalUrinalsForGirls.value = 0;
    }
    let total: string | number =
      parseInt(functionalUrinalsForBoys?.value) +
      parseInt(functionalUrinalsForGirls?.value);
    this.physicalFacilitiesInfoForm.patchValue({
      totalFunctionalUrinals: total,
    });
  }
  //CALCULATION OF Total Number of building blocks of the school AND VALIDATIONS START
  totalNoOfBuildings(
    puccaBuilding: any,
    PartiallyPuccaBuilding: any,
    kuchchaBuilding: any,
    tent: any,
    dilapidatedBuliding: any,
    buildingUnderConstruction: any
  ) {
    let pucbul= parseInt(puccaBuilding?.value) ?  parseInt(puccaBuilding?.value) : 0; 
    let parPucBul= parseInt(PartiallyPuccaBuilding?.value) ?  parseInt(PartiallyPuccaBuilding?.value) : 0; 
    let kucBul= parseInt(kuchchaBuilding?.value) ?  parseInt(kuchchaBuilding?.value) : 0; 
    let tnt= parseInt(tent?.value) ?  parseInt(tent?.value) : 0; 
    let dilBul= parseInt(dilapidatedBuliding?.value) ?  parseInt(dilapidatedBuliding?.value) : 0; 
    let buldUndCon= parseInt(buildingUnderConstruction?.value) ?  parseInt(buildingUnderConstruction?.value) : 0; 
    let total: string | number = pucbul+parPucBul+kucBul+tnt+dilBul+buldUndCon
     
    this.physicalFacilitiesInfoForm.patchValue({
      totalNoOfBuilding: total,
    });
  }
  // ERROR VALIDATION OF WATER CATEGORY START
  // WaterCategoryValid(data1: any, data2: any) {
  //   if (data2.value !== "" && data1.value == "") {
  //     this.alertHelper.viewAlert("error","Invalid","Total number of units can not be blank")
  //       .then((res: any) => {
  //         data1.focus();
  //       });
  //   } else if (
  //     data2.value !== "" &&
  //     data1.value !== "" &&
  //     parseInt(data2.value) > parseInt(data1.value)
  //   ) {
  //     this.alertHelper.viewAlert("error","Invalid","Functional units can't be greater than total no of units")
  //       .then((res: any) => {
  //         data2.focus();
  //       });
  //   }
  // }
  //COMMON VALIDATION TO CHECK TOTAL NO IS SMALLER THEN FUNCTIONAL START
  totalToFunctionalValidation(totalItem: any, functionalItem: any) {
    if (
      totalItem.value !== "" &&
      functionalItem.value !== "" &&
      parseInt(functionalItem.value) > parseInt(totalItem.value)
    ) {
      this.alertHelper.viewAlert("error","Invalid","Total units can't be smaller than functional no of units")
        .then((res: any) => {
          totalItem.focus();
        });
    }
  }
  totalBooksValidation(totalItem: any, functionalItem: any) {
    if (
      totalItem.value !== "" &&
      functionalItem.value !== "" &&
      parseInt(functionalItem.value) > parseInt(totalItem.value)
    ) {
      this.alertHelper.viewAlert("error","Invalid","Total numbers of books can't be smaller than total number of books from NCERT,NBT or any other government publisher")
        .then((res: any) => {
          totalItem.focus();
        });
    }
  }
  editPhysicalFacilitiesInfo(encId: string, academicYear: any) {
    this.spinner.show();
    this.physicalFacilitiesInfoService
      .getPhysicalFacilitiesInfo(encId, academicYear)
      .subscribe((res: any) => {
        if (res.data.length > 0) {
          this.physicalFacilitiesInfoData = res.data[0];
          this.encId = this.physicalFacilitiesInfoData.encId;
          this.academicYear = this.physicalFacilitiesInfoData.academicYear;
          this.schoolId = this.physicalFacilitiesInfoData.schoolId;
          this.schoolBuildingStatus =
            this.physicalFacilitiesInfoData.schoolBuildingStatus;
          this.totalNoOfBuilding =
            this.physicalFacilitiesInfoData.totalNoOfBuilding;
          this.puccaBuilding = this.physicalFacilitiesInfoData.puccaBuilding;
          this.PartiallyPuccaBuilding =
            this.physicalFacilitiesInfoData.PartiallyPuccaBuilding;
          this.kuchchaBuilding =
            this.physicalFacilitiesInfoData.kuchchaBuilding;
          this.tent = this.physicalFacilitiesInfoData.tent;
          this.dilapidatedBuliding =
            this.physicalFacilitiesInfoData.dilapidatedBuliding;
          this.buildingUnderConstruction =
            this.physicalFacilitiesInfoData.buildingUnderConstruction;
          this.typeOfBoundaryWall =
            this.physicalFacilitiesInfoData.typeOfBoundaryWall;
          this.classRoomForInstructional =
            this.physicalFacilitiesInfoData.classRoomForInstructional;
          this.classRoomUnderConstruction =
            this.physicalFacilitiesInfoData.classRoomUnderConstruction;
          this.classRoomUnderdilapidated =
            this.physicalFacilitiesInfoData.classRoomUnderdilapidated;
          this.classForPreprimary =
            this.physicalFacilitiesInfoData.classForPreprimary;
          this.classForSecondary =
            this.physicalFacilitiesInfoData.classForSecondary;
          this.classForPrimary =
            this.physicalFacilitiesInfoData.classForPrimary;
          this.classHighersecondary =
            this.physicalFacilitiesInfoData.classHighersecondary;
          this.classUpperprimary =
            this.physicalFacilitiesInfoData.classUpperprimary;

          this.classCurrentlyNotInUse =
            this.physicalFacilitiesInfoData.classCurrentlyNotInUse;
          this.totClassForInstructional =
            this.physicalFacilitiesInfoData.totClassForInstructional;

          this.puccaClassGoodCondition =
            this.physicalFacilitiesInfoData.puccaClassGoodCondition;
          this.puccaClassMinorRepair =
            this.physicalFacilitiesInfoData.puccaClassMinorRepair;
          this.puccaClassMajorRepair =
            this.physicalFacilitiesInfoData.puccaClassMajorRepair;
          this.partiallyPuccaClassGoodCondition =
            this.physicalFacilitiesInfoData.partiallyPuccaClassGoodCondition;
          this.partiallyPuccaClassMinorRepair =
            this.physicalFacilitiesInfoData.partiallyPuccaClassMinorRepair;
          this.partiallyPuccaClassMajorRepair =
            this.physicalFacilitiesInfoData.partiallyPuccaClassMajorRepair;
          this.kuchchaClassGoodCondition =
            this.physicalFacilitiesInfoData.kuchchaClassGoodCondition;
          this.kuchchaClassMinorRepair =
            this.physicalFacilitiesInfoData.kuchchaClassMinorRepair;
          this.kuchchaClassMajorRepair =
            this.physicalFacilitiesInfoData.kuchchaClassMajorRepair;
          this.tentClassGoodCondition =
            this.physicalFacilitiesInfoData.tentClassGoodCondition;
          this.tentClassMinorRepair =
            this.physicalFacilitiesInfoData.tentClassMinorRepair;
          this.tentClassMajorRepair =
            this.physicalFacilitiesInfoData.tentClassMajorRepair;
          this.roomOtherThenClass =
            this.physicalFacilitiesInfoData.roomOtherThenClass;
          // this.isSeparateRoomForPrincipal =
          //   this.physicalFacilitiesInfoData.isSeparateRoomForPrincipal;
          this.isSchoolHaveToilet =
            this.physicalFacilitiesInfoData.isSchoolHaveToilet;
          this.totalToiletForBoysExcludCwsn =
            this.physicalFacilitiesInfoData.totalToiletForBoysExcludCwsn;
          this.functionalToiletForBoysExcludCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForBoysExcludCwsn;
          this.totalToiletForGirlsExcludCwsn =
            this.physicalFacilitiesInfoData.totalToiletForGirlsExcludCwsn;
          this.functionalToiletForGirlsExcludCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForGirlsExcludCwsn;
          this.totalNoOfToiletExcludCwsn =
            this.physicalFacilitiesInfoData.totalNoOfToiletExcludCwsn;
          this.totalFunctionalToiletExcludCwsn =
            this.physicalFacilitiesInfoData.totalFunctionalToiletExcludCwsn;
          this.totalToiletForBoysOnCwsn =
            this.physicalFacilitiesInfoData.totalToiletForBoysOnCwsn;
          this.functionalToiletForBoysOnCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForBoysOnCwsn;
          this.totalToiletForGirlsOnCwsn =
            this.physicalFacilitiesInfoData.totalToiletForGirlsOnCwsn;
          this.functionalToiletForGirlsOnCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForGirlsOnCwsn;
          this.totalNoOfToiletOnCwsn =
            this.physicalFacilitiesInfoData.totalNoOfToiletOnCwsn;
          this.totalFunctionalToiletOnCwsn =
            this.physicalFacilitiesInfoData.totalFunctionalToiletOnCwsn;
          this.totalToiletForBoysIncludeCwsn =
            this.physicalFacilitiesInfoData.totalToiletForBoysIncludeCwsn;
          this.functionalToiletForBoysIncludeCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForBoysIncludeCwsn;
          this.totalToiletForGirlsIncludeCwsn =
            this.physicalFacilitiesInfoData.totalToiletForGirlsIncludeCwsn;
          this.functionalToiletForGirlsIncludeCwsn =
            this.physicalFacilitiesInfoData.functionalToiletForGirlsIncludeCwsn;
          this.totalNoOfToiletIncludeCwsn =
            this.physicalFacilitiesInfoData.totalNoOfToiletIncludeCwsn;
          this.totalFunctionalToiletIncludeCwsn =
            this.physicalFacilitiesInfoData.totalFunctionalToiletIncludeCwsn;
          this.totalUrinalsForBoys =
            this.physicalFacilitiesInfoData.totalUrinalsForBoys;
          this.functionalUrinalsForBoys =
            this.physicalFacilitiesInfoData.functionalUrinalsForBoys;
          this.totalUrinalsForGirls =
            this.physicalFacilitiesInfoData.totalUrinalsForGirls;
          this.functionalUrinalsForGirls =
            this.physicalFacilitiesInfoData.functionalUrinalsForGirls;
          this.totalNoOfUrinals =
            this.physicalFacilitiesInfoData.totalNoOfUrinals;
          this.totalFunctionalUrinals =
            this.physicalFacilitiesInfoData.totalFunctionalUrinals;
          this.watterAvailInFunctionalTiletsForBoys =
            this.physicalFacilitiesInfoData.watterAvailInFunctionalTiletsForBoys;
          this.watterAvailInFunctionalTiletsForGirls =
            this.physicalFacilitiesInfoData.watterAvailInFunctionalTiletsForGirls;
          this.watterAvailInFunctionalUrinalsForBoys =
            this.physicalFacilitiesInfoData.watterAvailInFunctionalUrinalsForBoys;
          this.watterAvailInFunctionalUrinalsForGirls =
            this.physicalFacilitiesInfoData.watterAvailInFunctionalUrinalsForGirls;
          this.isHandWashingAvailAtToilet =
            this.physicalFacilitiesInfoData.isHandWashingAvailAtToilet;
          this.isIncineratorAvail =
            this.physicalFacilitiesInfoData.isIncineratorAvail;
          this.isDrinkingWaterAvail =
            this.physicalFacilitiesInfoData.isDrinkingWaterAvail;

          this.isHandPumpAvail =
            this.physicalFacilitiesInfoData.isHandPumpAvail;
          this.isHandPumpFunctional =
            this.physicalFacilitiesInfoData.isHandPumpFunctional;
          this.isProtectedWellAvail =
            this.physicalFacilitiesInfoData.isProtectedWellAvail;
          this.isProtectedWellFunctional =
            this.physicalFacilitiesInfoData.isProtectedWellFunctional;
          this.isUnProtectedWellAvail =
            this.physicalFacilitiesInfoData.isUnProtectedWellAvail;
          this.isUnProtectedWellFunctional =
            this.physicalFacilitiesInfoData.isUnProtectedWellFunctional;
          this.isTapWaterAvail =
            this.physicalFacilitiesInfoData.isTapWaterAvail;
          this.isTapWaterFunctional =
            this.physicalFacilitiesInfoData.isTapWaterFunctional;
          this.isBottledWaterAvail =
            this.physicalFacilitiesInfoData.isBottledWaterAvail;
          this.isBottledWaterFunctional =
            this.physicalFacilitiesInfoData.isBottledWaterFunctional;
          this.isOtherWaterAvail =
            this.physicalFacilitiesInfoData.isOtherWaterAvail;
          this.isOtherWaterFunctional =
            this.physicalFacilitiesInfoData.isOtherWaterFunctional;
          // this.totalHandPumpAvail =
          //   this.physicalFacilitiesInfoData.totalHandPumpAvail;
          // this.functionalHandPumpAvail =
          //   this.physicalFacilitiesInfoData.functionalHandPumpAvail;
          // this.totalProtectedWellAvail =
          //   this.physicalFacilitiesInfoData.totalProtectedWellAvail;
          // this.functionalProtectedWellAvail =
          //   this.physicalFacilitiesInfoData.functionalProtectedWellAvail;
          // this.totalUnProtectedWellAvail =
          //   this.physicalFacilitiesInfoData.totalUnProtectedWellAvail;
          // this.functionalUnProtectedWellAvail =
          //   this.physicalFacilitiesInfoData.functionalUnProtectedWellAvail;
          // this.totalTapWaterAvail =
          //   this.physicalFacilitiesInfoData.totalTapWaterAvail;
          // this.functionalTapWaterAvail =
          //   this.physicalFacilitiesInfoData.functionalTapWaterAvail;
          // this.totalBottledWaterAvail =
          //   this.physicalFacilitiesInfoData.totalBottledWaterAvail;
          // this.functionalBottledWaterAvail =
          //   this.physicalFacilitiesInfoData.functionalBottledWaterAvail;
          // this.totalotherWaterAvail =
          //   this.physicalFacilitiesInfoData.totalotherWaterAvail;
          // this.functionalotherWaterAvail =
          //   this.physicalFacilitiesInfoData.functionalotherWaterAvail;
          this.isPurifierAvail =
            this.physicalFacilitiesInfoData.isPurifierAvail;
          this.isWaterQualityTested =
            this.physicalFacilitiesInfoData.isWaterQualityTested;
          this.isRainWaterHarvestingAvail =
            this.physicalFacilitiesInfoData.isRainWaterHarvestingAvail;
          this.isHandWashingAvail =
            this.physicalFacilitiesInfoData.isHandWashingAvail;
          this.noOfWashPoints = this.physicalFacilitiesInfoData.noOfWashPoints;
          this.isElectricityAvail =
            this.physicalFacilitiesInfoData.isElectricityAvail;
          this.isSolarPanelAvail =
            this.physicalFacilitiesInfoData.isSolarPanelAvail;
          this.isLibraryAvail = this.physicalFacilitiesInfoData.isLibraryAvail;
          this.totalBookInLibrary =
            this.physicalFacilitiesInfoData.totalBookInLibrary;
          this.bookFromGovtPublisherInLibrary =
            this.physicalFacilitiesInfoData.bookFromGovtPublisherInLibrary;
          this.isBookBankAvail =
            this.physicalFacilitiesInfoData.isBookBankAvail;
          this.totalBookInBookBank =
            this.physicalFacilitiesInfoData.totalBookInBookBank;
          this.bookFromGovtPublisherInBookbank =
            this.physicalFacilitiesInfoData.bookFromGovtPublisherInBookbank;
          this.isReadingCornerAvail =
            this.physicalFacilitiesInfoData.isReadingCornerAvail;
          this.totalBookInReadingCorner =
            this.physicalFacilitiesInfoData.totalBookInReadingCorner;
          this.isLibrarianAvail =
            this.physicalFacilitiesInfoData.isLibrarianAvail;
          this.isNewspaperAvail =
            this.physicalFacilitiesInfoData.isNewspaperAvail;
          this.islandExpansionAvil =
            this.physicalFacilitiesInfoData.islandExpansionAvil;
          this.isPlaygroundAvail =
            this.physicalFacilitiesInfoData.isPlaygroundAvail;
          this.isAdjoiningPlaygroundAvail =
            this.physicalFacilitiesInfoData.isAdjoiningPlaygroundAvail;
          this.isMedicalCheckupConducted =
            this.physicalFacilitiesInfoData.isMedicalCheckupConducted;
          this.noOfMedicalCheckupConducted =
            this.physicalFacilitiesInfoData.noOfMedicalCheckupConducted;

          this.isHeightParameterAvail =
            this.physicalFacilitiesInfoData.isHeightParameterAvail;
          this.isWeightParameterAvail =
            this.physicalFacilitiesInfoData.isWeightParameterAvail;
          this.isEyesParameterAvail =
            this.physicalFacilitiesInfoData.isEyesParameterAvail;
          this.isDentalParameterAvail =
            this.physicalFacilitiesInfoData.isDentalParameterAvail;
          this.isThroatParameterAvail =
            this.physicalFacilitiesInfoData.isThroatParameterAvail;

          this.isDewormingTabletGiven =
            this.physicalFacilitiesInfoData.isDewormingTabletGiven;
          this.isAnnualHealthRecordMaintained =
            this.physicalFacilitiesInfoData.isAnnualHealthRecordMaintained;
          this.isTharmalScannerAvail =
            this.physicalFacilitiesInfoData.isTharmalScannerAvail;
          this.isFirstAidKitAvail =
            this.physicalFacilitiesInfoData.isFirstAidKitAvail;
          this.isLifeSavingMedicineAvail =
            this.physicalFacilitiesInfoData.isLifeSavingMedicineAvail;
          this.isIronAndFolicTabletsGiven =
            this.physicalFacilitiesInfoData.isIronAndFolicTabletsGiven;
          this.isRampAvail = this.physicalFacilitiesInfoData.isRampAvail;
          this.isHandRailsForRampAvail =
            this.physicalFacilitiesInfoData.isHandRailsForRampAvail;
          this.isSpecialEducatorAvail =
            this.physicalFacilitiesInfoData.isSpecialEducatorAvail;
          this.isKitchenGardenAvail =
            this.physicalFacilitiesInfoData.isKitchenGardenAvail;
          this.isEachClassRoomDustbinAvail =
            this.physicalFacilitiesInfoData.isEachClassRoomDustbinAvail;
          this.isToiletDustbinAvail =
            this.physicalFacilitiesInfoData.isToiletDustbinAvail;
          this.isKitchenDustbinAvail =
            this.physicalFacilitiesInfoData.isKitchenDustbinAvail;
          this.isFurnitureAvail =
            this.physicalFacilitiesInfoData.isFurnitureAvail;
          this.noOfFurnitureAvail =
            this.physicalFacilitiesInfoData.noOfFurnitureAvail;
          this.draftStatus = this.physicalFacilitiesInfoData.draftStatus;

          this.initializeForm();
          this.spinner.hide();
        }
      });
  }
  onSubmit() {
   
    if (this.physicalFacilitiesInfoForm.invalid) {
      this.customValidators.formValidationHandler(this.physicalFacilitiesInfoForm, this.allLabel, this.el);
    }
    if (this.physicalFacilitiesInfoForm.invalid) {
      return;
    }
    // DEPENDANCY VALIDATION START
    if (this.physicalFacilitiesInfoForm.get("isSchoolHaveToilet")?.value == 1) {
      if (
        this.physicalFacilitiesInfoForm.controls["totalNoOfToiletIncludeCwsn"]
          ?.value == "" ||
        this.physicalFacilitiesInfoForm.controls["totalNoOfToiletIncludeCwsn"]
          ?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totalNoOfToiletIncludeCwsn"]');
          invalidControl.focus();
       
      this.alertHelper.viewAlert("error","Invalid","Total numbers of toilets Is required");
        return;
      }
      if (
        this.physicalFacilitiesInfoForm.controls["isHandWashingAvailAtToilet"]
          ?.value == ""
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isHandWashingAvailAtToilet"]');
          invalidControl.focus();
       
      this.alertHelper.viewAlert("error","Invalid","Is hand washing facility with soap available near toilets/urinals block Is required");
        return;
      }
      if (
        this.physicalFacilitiesInfoForm.controls["isIncineratorAvail"]?.value ==
        ""
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isIncineratorAvail"]');
          invalidControl.focus();
      this.alertHelper.viewAlert("error","Invalid","Whether incinerator is available in/ attached to girls toilet Is required");
        return;
      }
    }
    if (
      this.physicalFacilitiesInfoForm.get("isDrinkingWaterAvail")?.value == 1
    ) {
      if (
        this.physicalFacilitiesInfoForm.controls["totalHandPumpAvail"]?.value ==
          0 &&
        this.physicalFacilitiesInfoForm.controls["totalProtectedWellAvail"]
          ?.value == 0 &&
        this.physicalFacilitiesInfoForm.controls["totalUnProtectedWellAvail"]
          ?.value == 0 &&
        this.physicalFacilitiesInfoForm.controls["totalTapWaterAvail"]?.value ==
          0 &&
        this.physicalFacilitiesInfoForm.controls["totalBottledWaterAvail"]
          ?.value == 0 &&
        this.physicalFacilitiesInfoForm.controls["totalotherWaterAvail"]
          ?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isDrinkingWaterAvail"]');
          invalidControl.focus();
      this.alertHelper.viewAlert("error","Invalid","Total no of hand pumps required");

        return;
      }
    }
    if (this.physicalFacilitiesInfoForm.get("isHandWashingAvail")?.value == 1) {
      if (
        this.physicalFacilitiesInfoForm.controls["noOfWashPoints"]?.value ==
          "" ||
        this.physicalFacilitiesInfoForm.controls["noOfWashPoints"]?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="noOfWashPoints"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of wash points required");
        return;
      }
    }
    if (this.physicalFacilitiesInfoForm.get("isLibraryAvail")?.value == 1) {
      if (
        this.physicalFacilitiesInfoForm.controls["totalBookInLibrary"]?.value ==
          "" ||
        this.physicalFacilitiesInfoForm.controls["totalBookInLibrary"]?.value ==
          0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totalBookInLibrary"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total numbers of books in library required");

        return;
      }
    }
    if (this.physicalFacilitiesInfoForm.get("isBookBankAvail")?.value == 1) {
      if (
        this.physicalFacilitiesInfoForm.controls["totalBookInBookBank"]
          ?.value == "" ||
        this.physicalFacilitiesInfoForm.controls["totalBookInBookBank"]
          ?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totalBookInBookBank"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total numbers of books In book bank required");
        return;
      }
    }
    if (
      this.physicalFacilitiesInfoForm.get("isReadingCornerAvail")?.value == 1
    ) {
      if (
        this.physicalFacilitiesInfoForm.controls["totalBookInReadingCorner"]
          ?.value == "" ||
        this.physicalFacilitiesInfoForm.controls["totalBookInReadingCorner"]
          ?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totalBookInReadingCorner"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total numbers of books in reading corner required");
        return;
      }
    }
    if (this.physicalFacilitiesInfoForm.get("isPlaygroundAvail")?.value == 2) {
      if (
        this.physicalFacilitiesInfoForm.controls["isAdjoiningPlaygroundAvail"]
          ?.value == ""
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isAdjoiningPlaygroundAvail"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Adjoining playground/municipal park required");
        return;
      }
    }
    if (
      this.physicalFacilitiesInfoForm.get("isMedicalCheckupConducted")?.value ==
      1
    ) {
      if (
        this.physicalFacilitiesInfoForm.controls["noOfMedicalCheckupConducted"]
          ?.value == "" ||
        this.physicalFacilitiesInfoForm.controls["noOfMedicalCheckupConducted"]
          ?.value == 0
      ) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="noOfMedicalCheckupConducted"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total number of medical check-ups conducted in the school during last academic year required");
        return;
      }
    }
    if (this.physicalFacilitiesInfoForm.get("isFurnitureAvail")?.value == 1 ||this.physicalFacilitiesInfoForm.get("isFurnitureAvail")?.value == 2) {
      if (this.physicalFacilitiesInfoForm.controls["noOfFurnitureAvail"]?.value =="" ||this.physicalFacilitiesInfoForm.controls["noOfFurnitureAvail"]?.value ==0) {
        const invalidControl = this.el.nativeElement.querySelector('[formControlName="noOfFurnitureAvail"]');
        invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of students for whom furniture is available required");
        return;
      }
    }
   
    //DEPENDANCY VALIDATION END
    if (this.physicalFacilitiesInfoForm.valid === true) {
      if(this.draftStatus==1){
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.physicalFacilitiesInfoService
              .physicalFacilitiesInfoUpdate(this.physicalFacilitiesInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Physical facilities information saved successfully.",
                      "success"
                    )
                    .then(() => {
                      // this.initializeForm();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide();
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
              });
          }
        });
      }else{
        this.alertHelper.updateAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.physicalFacilitiesInfoService
              .physicalFacilitiesInfoUpdate(this.physicalFacilitiesInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Physical facilities information updated successfully.",
                      "success"
                    )
                    .then(() => {
                      // this.initializeForm();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide();
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
              });
          }
        });
      }
     
    }
  }
  pageChangeWarningHandler(path: string) {
    let isFormFilled: boolean = false;
    const otherInfoObj = this.physicalFacilitiesInfoForm?.value; 
    for (const property in otherInfoObj) {
      if (otherInfoObj[property]) {
        isFormFilled = true;
        break;
      }
    }
    if (isFormFilled === true) {
      this.commonFunctionHelper.pageChangeWarningHandler(
        path,
        this.encId,
        this.router
      );
    } else {
      this.route.navigate([path, this.encId], {
        relativeTo: this.router,
      });
    }
  }

}
