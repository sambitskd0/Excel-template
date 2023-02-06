export class Constant {
  genderList = { 1: "Male", 2: "Female", 3: "Transgender" };
  religionList = {
    1: "Hinduism",
    2: "Islam",
    3: "Sikhism",
    4: "Christianity",
    5: "Others",
  };
  socialCatagoryList = {
    1: "Unreserved",
    2: "SC",
    3: "ST",
    4: "BC",
    5: "MBC",
    6: "Other Reserve Category",
  };
  maritalList = {
    1: "Un-married",
    2: "Married",
    3: "Widow",
    4: "Divorced",
    5: "Separated",
  };
  bloodGroupList = {
    1: "A+",
    2: "A-",
    3: "B+",
    4: "B-",
    6: "O+",
    7: "O-",
    8: "AB+",
    9: "AB-",
  };

  getAcademicCurrentYear(
    year = new Date().getFullYear(),
    month = new Date().getMonth()
  ) {
    if (month > 3) {
      return `${year}-${String(year + 1).slice(-2)}`;
    } else {
      return `${year - 1}-${String(year).slice(-2)}`;
    }
  }

  linkType = { 1: "GL", 2: "PL", 3: "TB", 4: "BT" };
  privilege = { 1: "view", 4: "admin" };

  contentType: any = { 1: "English", 2: "Hindi" };
  typeOfAttachment: any = { 1: "Nothing", 2: "Document", 3: "URL" };
  questionBank: any = {
    maxDuration: 180, // 180 min i.e 3 hour
    minDuration: 15, // 15 min
  };
}
