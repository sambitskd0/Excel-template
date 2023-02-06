import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { PhysicalFacilitiesInfoService } from "../../../services/physical-facilities-info.service";
import { SchoolService } from "../../../services/school.service";
@Component({
  selector: 'app-view-pfi',
  templateUrl: './view-pfi.component.html',
  styleUrls: ['./view-pfi.component.css']
})
export class ViewPfiComponent implements OnInit {

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

  anexType: any = "";
  schoolBuildingStatusData: any = "";
  typeOfBoundaryWallData: any = "";
  userProfile: any = [];
  userId:any="";
  constructor(
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private physicalFacilitiesInfoService: PhysicalFacilitiesInfoService,
    private el: ElementRef,
    private schoolService: SchoolService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.encId = this.router.snapshot.params["encId"];
    this.getMaxAndMinClassAndMgmt(this.encId, this.academicYear);
    this.spinner.hide();
  }

  loadAnnexturesData() {
    const anxTypes = [
      "STATUS_OF_SCHOOL_BUILDING",
      "TYPE_OF_BOUNDARY_WALL",
    ];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonserviceService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.schoolBuildingStatusData = res?.data?.STATUS_OF_SCHOOL_BUILDING;
        this.typeOfBoundaryWallData = res?.data?.TYPE_OF_BOUNDARY_WALL;
        this.editPhysicalFacilitiesInfo(this.encId, this.academicYear);
      },
    });
  }

  getMaxAndMinClassAndMgmt(encId: any, academicYear: any) {
    this.schoolService
      .getMaxAndMinClassAndMgmt(encId, academicYear)
      .subscribe((res:any) => {
        this.highestClass = res.data?.maxClass;
        this.lowestClass =res.data?.minClass;
        this.schoolMgt=res.data?.management;
        this.loadAnnexturesData();
      });
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

          this.schoolBuildingStatus = this.physicalFacilitiesInfoData.schoolBuildingStatus;
          this.schoolBuildingStatus=this.schoolBuildingStatusData.filter((item:any) => item.anxtValue === this.schoolBuildingStatus)[0]['anxtName'];

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

          this.typeOfBoundaryWall = this.physicalFacilitiesInfoData.typeOfBoundaryWall;
          this.typeOfBoundaryWall=this.typeOfBoundaryWallData.filter((item:any) => item.anxtValue === this.typeOfBoundaryWall)[0]['anxtName'];

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
        }
        this.spinner.hide();
      
      });
  }

}
