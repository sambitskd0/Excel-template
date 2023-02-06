import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService, Spinner } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { SchoolService } from "../../../services/school.service";
import { Constant } from "src/app/shared/constants/constant";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: 'app-update-other-info',
  templateUrl: './update-other-info.component.html',
  styleUrls: ['./update-other-info.component.css']
})
export class UpdateOtherInfoComponent implements OnInit {
  // dropdownSettings: IDropdownSettings = {};
  // dropdownSettings1: IDropdownSettings = {};
  schoolOtherInfoForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
  submitted: boolean = false;
  classCategory: any;
  schoolType: any = "";

  govtSchool: boolean = false;
  privateSchool: boolean = false;
  jnkvSchool: boolean = false;

  schoolInfo: any = [];
  allLabel: string[] = [
    "",
    "",
    "",
    "",
    // section-1
    "Whether pre-primary section (other than anganwadi) attached to school",
    "Streams available in the school (in case of schools with higher secondary sections) of arts",
    "Streams available in the school (in case of schools with higher secondary sections) of science",
    "Streams available in the school (in case of schools with higher secondary sections) of commerce ",
    "Streams available in the school (in case of schools with higher secondary sections) of vocational ",
    "Streams available in the school (in case of schools with higher secondary sections) of other streams ",
    "Number of sections for class 1",
    "Number of sections for class 2",
    "Number of sections for class 3",
    "Number of sections for class 4",
    "Number of sections for class 5",
    "Number of sections for class 6",
    "Number of sections for class 7",
    "Number of sections for class 8",
    "Number of sections for class 9",
    "Number of sections for class 10",
    "Number of sections for class 11",
    "Number of sections for class 12",
    // section-1 end
    // section-2 start
    "Year of establishment of school",
    //new add
    "Recognition year of primary",
    "Recognition year of upper primary",
    "Recognition year of secondery",
    "Recognition year of higher secondery",

    "Year of up-gradation of primary to upper Primary",
    "Year of up-gradation of  upper Primary to secondary",
    "Year of up-gradation of  secondary to higher secondary",
    // section-2 end
    // section-3 start
    "Is this a special school for CWSN",
    "Type of special school",
    "Is this a shift school",
    "Does the school run any skill training centre after school hours",
    "Is this a residential school",
    "Residential category",
    "Type of residential school",

    "Residential school available seats class 6 boys",
    "Residential school available seats class 6 girls",
    "Residential school available seats class 7 boys",
    "Residential school available seats class 7 girls",
    "Residential school available seats class 8 boys",
    "Residential school available seats class 8 girls",
    "Residential school available seats class 9 boys",
    "Residential school available seats class 9 girls",
    "Residential school available seats class 10 boys",
    "Residential school available seats class 10 girls",
    "Residential school available seats class 11 boys",
    "Residential school available seats class 11 girls",
    "Residential school available seats class 12 boys",
    "Residential school available seats class 12 girls",

    "If 3-non-residential, is there any hostel where most of the students of this school stay",
    "Type of hostel",
    "Boarding facilities  are available for primary",
    "Boarding facilities  are available for primary boys",
    "Boarding facilities  are available for primary girls",
    "Boarding facilities  are available for primary transgender",

    "Boarding facilities  are available for upper primary",
    "Boarding facilities  are available for upper primary boys",
    "Boarding facilities  are available for upper  primary girls",
    "Boarding facilities  are available for upper primary transgender",

    "Boarding facilities  are available for secondery",
    "Boarding facilities  are available for secondery boys",
    "Boarding facilities  are available for secondery girls",
    "Boarding facilities  are available for secondery transgender",

    "Boarding facilities  are available for higher secondery",
    "Boarding facilities  are available for higher secondery boys",
    "Boarding facilities  are available for higher secondery girls",
    "Boarding facilities  are available for higher secondery transgender",

    "Is this a minority-managed school",
    "Type of minority community managing the school",
    // section-3 end
    // Affiliation Board of school start

    "Affiliation board of school of secondary sections",
    "Affiliation board of school of affiliation number ",
    "If others, then name of the board",
    "Affiliation board of school of  higher secondary sections",
    "Affiliation board of school of  affiliation number",
    "If others, then name of the board",
     // Affiliation Board of school end
      // section-4 start

    "Are majority of the pupils taught through their mother tongue at the primary level",
    // "Medium of instruction (s) in the school",
    // "If other Medium, please specify",
    // "Language(s) taught as a subject (mention up to three languages)",
    // "If other languages, please specify",
    "Classes in which Language(s) are taught",
    "Students taking the language(boys)",
    "Students taking the language(girls)",
    "Students taking the language(transgender)",
    "Does the school offer any pre-vocational course(s) at Upper-Primary stage",
    "Does the school provide educational and vocational guidance/ counseling to students",
    // section-4 end
    // section-5 start
    // Distance of the school (in km.) from the nearest Govt./Aided school

    "Distance from Primary school/section",
    "Distance from Upper Primary school/section",
    "Distance from Secondary school/section",
    "Distance from Higher Secondary school/junior college",
    "Whether the school approachable by all-weather roads",

    // Number of instructional days (previous academic year)

    "Number of instructional days (previous academic year) of primary",
    "Number of instructional days (previous academic year) of Upper Primary",
    "Number of instructional days (previous academic year) of Secondary",
    "Number of instructional days (previous academic year) of Higher Secondary",

    // Average school hours for children (per day) - Number of hours children stay in school

    "Average school hours for children (per day) - Number of hours children stay in school of primary ",
    "Average school hours for children (per day) - Number of hours children stay in school of upper primary ",
    "Average school hours for children (per day) - Number of hours children stay in school of secondery ",
    "Average school hours for children (per day) - Number of hours children stay in school of higher secondery ",

    // Average working hours for Teachers (per day) - Number of hours teachers stay in school

    "Average working hours for Teachers (per day) - Number of hours teachers stay in school of primary",
    "Average working hours for Teachers (per day) - Number of hours teachers stay in school of upper primary",
    "Average working hours for Teachers (per day) - Number of hours teachers stay in school of secondery",
    "Average working hours for Teachers (per day) - Number of hours teachers stay in school of higher secondery",
    // section-5 end
    // section-6 start

    "Is Continuous and Comprehensive Evaluation (CCE) being implemented in school",
    "Primary of is CCE being implemented",
    "Number of assessments of primary made during the year",
    "Upper primary of Is CCE being implemented",
    "Number of Assessments of upper primary made during the year",
    "Secondary of is CCE being implemented",
    "Number of assessments of secondary made during the year",
    "Higher secondary of is CCE being implemented",
    "Number of assessments of higher secondary made during the year",
    "Are cumulative records of pupil being maintained",
    "Are cumulative records of pupil being shared with parents",
    "Assessment items are being prepared by",
    "When does the academic session start.Give the month (e.g. May should be written as 05-May)",
    // section-6 end
    // section-7 start
    // Only for Private Unaided Schools 

    "No. of children enrolled at entry level under section 12 of the RTE Act in current academic year",
    "No. of students continuing who got admission under section 12 of the RTE Act in previous years",

    "Total no. of students enrolled under section 12 of the RTE Act of class 1 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 1 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 1 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 1 cwsn of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 1 cwsn of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 1 cwsn of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 2 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 2 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 2 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 3 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 3 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 3 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 4 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 4 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 4 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 5 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 5 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 5 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 6 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 6 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 6 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 7 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 7 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 7 of transgender",

    "Total no. of students enrolled under section 12 of the RTE Act of class 8 of boys",
    "Total no. of students enrolled under section 12 of the RTE Act of class 8 of girls",
    "Total no. of students enrolled under section 12 of the RTE Act of class 8 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 1 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 1 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 1 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 2 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 2 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 2 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 3 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 3 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 3 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 4 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 4 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 4 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 5 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 5 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 5 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 6 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 6 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 6 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 7 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 7 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 7 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 8 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 8 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 8 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 9 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 9 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 9 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 10 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 10 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 10 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 11 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 11 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 11 of transgender",

    "No. of economically weaker section*(EWS) students enrolled class 12 of boys",
    "No. of economically weaker section*(EWS) students enrolled class 12 of girls",
    "No. of economically weaker section*(EWS) students enrolled class 12 of transgender",
    // section-7 end
    // section-8 start

    "Whether anganwadi centre located inside the school premises",
    "Code of the anganwadi centre",
    "Total children in anganwadi centre of boys",
    "Total children in anganwadi centre of girls",
    "Total children in anganwadi centre of transgender",
    "Is the anganwadi worker trained in early childhood education",
    "Whether anganwadi has adequate educational (1-Yes, 2-No) toys/ puppets/ games/ board games, etc.",
    "Whether balavatika is be started in the Co-located Anganwadi/school",
     // section-8 end
    // section-9 start

    "Whether any Out of school children enrolled in the school are attending special training",

    "No. of children enrolled for special training in current year of boys",
    "No. of children enrolled for special training in current year of girls",
    "No. of children enrolled for special training in current year of transgender",

    "No. of children enrolled for special training in previous academic year of boys",
    "No. of children enrolled for special training in previous academic year of girls",
    "No. of children enrolled for special training in previous academic year of transgender",

    "No. of children completed special training in previous academic year of boys",
    "No. of children completed special training in previous academic year of girls",
    "No. of children completed special training in previous academic year of transgender",

    "Who conducts special training",
    "Where is special training conducted",
    "Type of training being conducted",
    "No. of students attending remedial teaching in current year",
    "Number of students attending learning enhancement classes",
    // section-9 end
    // section-10 start
    // Details of visits to the school during the previous academic year 

    "No. of academic inspections",
    "No. of visits by CRC co-ordinator",
    "No. of visits by Block Level Officers (BRC/BEO)",
    "No of visits by District/State Level Officers",
    "No. of visits by Cluster Level Officer",
    "No. of visits by Regional Level Officer",
    "No. of visits by headquarter level officer",
    // section-10 end
    // section- 11 start  

    "Whether school management Committee (SMC) has been constituted",
    "Whether school development and management Committee have been constituted as per samagra shiksha guidelines",
    "Number of SMC/SDMC meetings conducted in previous Academic year",
    "Whether SMC/SDMC has prepared the school development plan",
    "If 1-Yes, mention the year",
    "Whether the school Building Committee (SBC) has been constituted",
    "Whether the school has constituted its academic committee (AC)",
    "Whether the school has constituted its Parent-Teacher Association (PTA)",
    "If 1-Yes, number of PTA meetings held during the last academic year",
    "Whether the school has multi-class units",
    "If 1-Yes, classes and number of children taught together in a single classroom of classes taught together",
    "If 1-Yes, classes and number of children taught together in a single classroom of total Students attending on a typical day in multi-class",
    "Is the school part of a school complex",
    "Is the school a hub school for the school complex",

    // "If 1-Yes, number of schools in the school complex of pre primary",
    "If 1-Yes, number of schools in the school complex of primary",
    "If 1-Yes, number of schools in the school complex of upper primary",
    "If 1-Yes, number of schools in the school complex of secondery",
    "If 1-Yes, number of schools in the school complex of higher secondery",
    "If 1-Yes, number of schools in the school complex of total",

    // section-11 end
    // section-12 start
    // Availability of free Textbooks, Teaching Learning Material (TLM) and play material (in current academic year)
    // Whether complete set of free textbooks received

    "Whether complete set of free textbooks received of primary",
    "Whether complete set of free textbooks received of upper primary",
    "Whether complete set of free textbooks received of secondery",
    "Whether complete set of free textbooks received of higher secondery",

    // Whether complete set of free textbooks received
    //  When were the textbooks received in current academic year
    
    "When were the textbooks received in current academic year (may should be written as 05-May of primary",
    "When were the textbooks received in current academic year (may should be written as 05-May of upper primary",
    "When were the textbooks received in current academic year (may should be written as 05-May of secondery",
    "When were the textbooks received in current academic year (may should be written as 05-May of higher secondery",
    //  When were the textbooks received in current academic year
    //  Whether TLM available for each grade
    "Whether TLM available for each grade of primary",
    "Whether TLM available for each grade of upper primary",
    "Whether TLM available for each grade of secondery",
    "Whether TLM available for each grade of higher secondery",
    //  Whether TLM available for each grade
    // If Yes, number of children provided core TLM for Language

    "Number of children provided core TLM for language for primary ",
    "Number of children provided core TLM for language for upper primary ",
    "Number of children provided core TLM for language for secondery ",
    "Number of children provided core TLM for language for higher secondery ",
    // If Yes, number of children provided core TLM for Language
    // If Yes, number of children provided core TLM for Mathematics
    
    "Number of children provided core TLM for mathmatics for primary ",
    "Number of children provided core TLM for mathmatics for upper primary ",
    "Number of children provided core TLM for mathmatics for secondery ",
    "Number of children provided core TLM for mathmatics for higher secondery ",

    // If Yes, number of children provided core TLM for Mathematics
    // Whether the School has received graded supplementary material in previous academic year

    "Whether the School has received graded supplementary material in previous academic year of primary",
    "Whether the School has received graded supplementary material in previous academic year of upper primary",
    "Whether the School has received graded supplementary material in previous academic year of secondery",
    "Whether the School has received graded supplementary material in previous academic year of higher secondery",

    // Whether the School has received graded supplementary material in previous academic year
    // If Yes, number of children provided Graded Supplementary Material

    "If Yes, number of children provided graded supplementary material of primary",
    "If Yes, number of children provided graded supplementary material of upper primary",
    "If Yes, number of children provided graded supplementary material of secondery",
    "If Yes, number of children provided graded supplementary material of higher secondery",

     // If Yes, number of children provided Graded Supplementary Material
    // Number of children having access to Supplementary graded material in school

    "Number of children having access to supplementary graded material in school of primary",
    "Number of children having access to supplementary graded material in school of upper primary",
    "Number of children having access to supplementary graded material in school of secondery",
    "Number of children having access to supplementary graded material in school of higher secondery",

    // Number of children having access to Supplementary graded material in school
    //  Number of books in the school library

    "Number of books in the school library of primary",
    "Number of books in the school library of upper  primary",
    "Number of books in the school library of secondery",
    "Number of books in the school library of higher secondery",

   //  Number of books in the school library
  // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)

    "Number of times library books have been borrowed/ read by children of that class (given total of issue register) of primary",
    "Number of times library books have been borrowed/ read by children of that class (given total of issue register) of upper primary",
    "Number of times library books have been borrowed/ read by children of that class (given total of issue register) of secondery",
    "Number of times library books have been borrowed/ read by children of that class (given total of issue register) of higher secondery",

    // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
    // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year

    "Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year of primary",
    "Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year of  upper primary",
    "Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year of secondery",
    "Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year of higher secondery",

    //Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
    // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN

    "Whether parents/ volunteers are actively involved in supporting the school to achieve FLN of primary",
    "Whether parents/ volunteers are actively involved in supporting the school to achieve FLN of upper primary",
    "Whether parents/ volunteers are actively involved in supporting the school to achieve FLN of secondery",
    "Whether parents/ volunteers are actively involved in supporting the school to achieve FLN of higher secondery",

    // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
    // Whether the school has introduced peer learning

    "Whether the school has introduced peer learning of primary",
    "Whether the school has introduced peer learning of upper primary",
    "Whether the school has introduced peer learning of secondery",
    "Whether the school has introduced peer learning of higher secondery",

    // Whether the school has introduced peer learning
    // Whether play material, games and sports equipment available for each grade

    "Whether play material, games and sports equipment available for each grade of primary",
    "Whether play material, games and sports equipment available for each grade of upper primary",
    "Whether play material, games and sports equipment available for each grade of secondery",
    "Whether play material, games and sports equipment available for each grade of higher secondery",

    // Whether play material, games and sports equipment available for each grade

    // section-12 end
    // section-13 start
    //key indicators
    // Number of learning outcome based assessment items created in total start

    "Number of learning outcome based assessment items created in total of class 1",
    "Number of learning outcome based assessment items created in total of class 2",
    "Number of learning outcome based assessment items created in total of class 3",
    "Number of learning outcome based assessment items created in total of class 4",
    "Number of learning outcome based assessment items created in total of class 5",
    "Number of learning outcome based assessment items created in total of class 6",
    "Number of learning outcome based assessment items created in total of class 7",
    "Number of learning outcome based assessment items created in total of class 8",
    "Number of learning outcome based assessment items created in total of class 9",
    "Number of learning outcome based assessment items created in total of class 10",
    "Number of learning outcome based assessment items created in total of class 11",
    "Number of learning outcome based assessment items created in total of class 12",

    // Number of learning outcome based assessment items created in total end
    // Number of criterionreferenced items created in Previous Academic Year start

    "Number of criterionreferenced items created in Previous academic Year of class 1 ",
    "Number of criterionreferenced items created in previous academic Year of class 2 ",
    "Number of criterionreferenced items created in previous academic Year of class 3 ",
    "Number of criterionreferenced items created in previous academic Year of class 4 ",
    "Number of criterionreferenced items created in previous academic Year of class 5 ",
    "Number of criterionreferenced items created in previous academic Year of class 6 ",
    "Number of criterionreferenced items created in previous academic Year of class 7 ",
    "Number of criterionreferenced items created in previous academic Year of class 8 ",
    "Number of criterionreferenced items created in previous academic Year of class 9 ",
    "Number of criterionreferenced items created in previous academic Year of class 10 ",
    "Number of criterionreferenced items created in previous academic Year of class 11 ",
    "Number of criterionreferenced items created in previous academic Year of class 12 ",

    // Number of criterionreferenced items created in Previous Academic Year start
    // Whether school teachers of this school created teaching aids/tools for teaching learning start

    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 1",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 2",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 3",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 4",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 5",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 6",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 7",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 8",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 9",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 10",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 11",
    "Whether school teachers of this school created teaching aids/tools for teaching learning of class 12",

    // Whether school teachers of this school created teaching aids/tools for teaching learning end
    // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start

    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 1",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 2",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 3",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 4",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 5",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 6",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 7",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 8",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 9",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 10",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 11",
    "Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc of class 12",

    // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
    // Total Number of HardSpots identified in Learning outcomes start

    "Total Number of HardSpots identified in Learning outcomes of class 1",
    "Total Number of HardSpots identified in Learning outcomes of class 2",
    "Total Number of HardSpots identified in Learning outcomes of class 3",
    "Total Number of HardSpots identified in Learning outcomes of class 4",
    "Total Number of HardSpots identified in Learning outcomes of class 5",
    "Total Number of HardSpots identified in Learning outcomes of class 6",
    "Total Number of HardSpots identified in Learning outcomes of class 7",
    "Total Number of HardSpots identified in Learning outcomes of class 8",
    "Total Number of HardSpots identified in Learning outcomes of class 9",
    "Total Number of HardSpots identified in Learning outcomes of class 10",
    "Total Number of HardSpots identified in Learning outcomes of class 11",
    "Total Number of HardSpots identified in Learning outcomes of class 12",

    // Total Number of HardSpots identified in Learning outcomes end
    // Number of students received orientation on cyber safety start

    "Number of students received orientation on cyber safety of class 1",
    "Number of students received orientation on cyber safety of class 2",
    "Number of students received orientation on cyber safety of class 3",
    "Number of students received orientation on cyber safety of class 4",
    "Number of students received orientation on cyber safety of class 5",
    "Number of students received orientation on cyber safety of class 6",
    "Number of students received orientation on cyber safety of class 7",
    "Number of students received orientation on cyber safety of class 8",
    "Number of students received orientation on cyber safety of class 9",
    "Number of students received orientation on cyber safety of class 10",
    "Number of students received orientation on cyber safety of class 11",
    "Number of students received orientation on cyber safety of class 12",
    // Number of students received orientation on cyber safety end
    // Number of students received training on psycho-social aspects start

    "Number of students received training on psycho-social aspects of class 1",
    "Number of students received training on psycho-social aspects of class 2",
    "Number of students received training on psycho-social aspects of class 3",
    "Number of students received training on psycho-social aspects of class 4",
    "Number of students received training on psycho-social aspects of class 5",
    "Number of students received training on psycho-social aspects of class 6",
    "Number of students received training on psycho-social aspects of class 7",
    "Number of students received training on psycho-social aspects of class 8",
    "Number of students received training on psycho-social aspects of class 9",
    "Number of students received training on psycho-social aspects of class 10",
    "Number of students received training on psycho-social aspects of class 11",
    "Number of students received training on psycho-social aspects of class 12",
    // Number of students received training on psycho-social aspects end
    // section-13 end
  ];
  encId: string = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  draftStatus: any = 1;
  specialSchoolTypeChanged: boolean = false;
  specialSchoolTypeData: any = [];
  residentialCategoryChanged: boolean = false;
  residentialCategoryData: any = [];
  residentialSchoolTypeChanged: boolean = false;
  residentialSchoolTypeData: any = [];
  hostleTypeChanged: boolean = false;
  hostleTypeData: any = [];
  minorityCommunityChanged: boolean = false;
  minorityCommunityData: any = [];
  mediumOfInstructionsChanged: boolean = false;
  mediumOfInstructionsData: any = [];
  languagesTaughtChanged: boolean = false;
  languagesTaughtData: any = [];
  secondarySectionsChanged: boolean = false;
  secondarySectionsData: any = [];
  higherSecondarySectionsChanged: boolean = false;
  higherSecondarySectionsData: any = [];

  /* Initialize form controls :: Start */
  // section-1 start
  highestClass: any             = "";
  lowestClass: any              = "";
  isPrePrimaryAttached: any     = "2";
  streamAvailForArts: any       = "0";
  streamAvailForScience: any    = "0";
  streamAvailForCommerce: any   = "0";
  streamAvailForVocational: any = "0";
  streamAvailForOther: any      = "0";
  noOfSecCls1: any              = "";
  noOfSecCls2: any              = "";
  noOfSecCls3: any              = "";
  noOfSecCls4: any              = "";
  noOfSecCls5: any              = "";
  noOfSecCls6: any              = "";
  noOfSecCls7: any              = "";
  noOfSecCls8: any              = "";
  noOfSecCls9: any              = "";
  noOfSecCls10: any             = "";
  noOfSecCls11: any             = "";
  noOfSecCls12: any             = "";
  // section-1 end
  // section-2 Start
  yearOfEstd: any               = "";
  recogYearOfP: any             = "";
  recogYearOfUP: any            = "";
  recogYearOfS: any             = "";
  recogYearOfHS: any            = "";
  yearOfUpgradePtoUP: any       = "";
  yearOfUpgradeUPtoS: any       = "";
  yearOfUpgradeStoHS: any       = "";
  // section-2 end
  // section-3 start
  isSpecialschCWSN: any         = "2";
  specialSchType: any           = "";
  isShiftsch: any               = "2";
  runSkillTrainingCenter: any   = "2";
  isResidentalsch: any          = "2";
  residentialCategory: any      = "";
  residentalSchType: any        = "";
  residSchSeatsCls6Boys: any    = "";
  residSchSeatsCls6Girls: any   = "";
  residSchSeatsCls7Boys: any    = "";
  residSchSeatsCls7Girls: any   = "";
  residSchSeatsCls8Boys: any    = "";
  residSchSeatsCls8Girls: any   = "";
  residSchSeatsCls9Boys: any    = "";
  residSchSeatsCls9Girls: any   = "";
  residSchSeatsCls10Boys: any   = "";
  residSchSeatsCls10Girls: any  = "";
  residSchSeatsCls11Boys: any   = "";
  residSchSeatsCls11Girls: any  = "";
  residSchSeatsCls12Boys: any   = "";
  residSchSeatsCls12Girls: any  = "";
  isHostle: any = "2";
  hostleType: any = "";
  boardingU: any = "1";
  boardingUBoys: any = "";
  boardingUGirls: any = "";
  boardingUTrans: any = "";
  boardingUP: any = "1";
  boardingUPBoys: any = "";
  boardingUPGirls: any = "";
  boardingUPTrans: any = "";
  boardingS: any = "1";
  boardingSBoys: any = "";
  boardingSGirls: any = "";
  boardingSTrans: any = "";
  boardingHS: any = "1";
  boardingHSBoys: any = "";
  boardingHSGirls: any = "";
  boardingHSTrans: any = "";
  isMinorityManagedSch: any = "2";
  minorityType: any = "";
  //section-3 end
  //Affiliation Board of school  start
  afSCSec: any = "";
  afNum: any = "";
  afSCOthBoard: any = "";
  afHSSec: any = "";
  afHSNum: any = "";
  afHSOthBoard: any = "";
  //Affiliation Board of school  end
  // section-4 start
  isTaughtMotherTongue: any = "2";
  // mediumOfInstructions: any = [];
  // mediumOfInstructionsOth: any = "";
  // languagesTaught: any = "";
  // otherLanguagesTaught: any = "";
  languagesTaughtClas: any = "";
  stdTLangBoys: any = "";
  stdTLangGirl: any = "";
  stdTLangTrans: any = "";
  isPreVocUP: any = "2";
  isProvVocEdu: any = "2";
  // section-4 end
  // section-5 start
  // Distance of the school (in km.) from the nearest Govt./Aided school
  distSchPM: any = "";
  distSchUP: any = "";
  distSchSC: any = "";
  distSchHS: any = "";
  isSchApprochRoad: any = "2";
  // Number of instructional days (previous academic year)
  numInsDayPM: any = "";
  numInsDayUP: any = "";
  numInsDaySC: any = "";
  numInsDayHS: any = "";
  // Average school hours for children (per day) - Number of hours children stay in school
  avgChHrPM: any = "";
  avgChHrUP: any = "";
  avgChHrSC: any = "";
  avgChHrHS: any = "";
  // Average working hours for Teachers (per day) - Number of hours teachers stay in school
  avgTHrPM: any = "";
  avgTHrUP: any = "";
  avgTHrSC: any = "";
  avgTHrHS: any = "";
  // section-5 end
  // section-6 start
  isCCESch: any = "2";
  isCCEPM: any = "2";
  isCCENumAssPM: any = "";
  isCCEUP: any = "2";
  isCCENumAssUP: any = "";
  isCCESC: any = "2";
  isCCENumAssSC: any = "";
  isCCEHS: any = "2";
  isCCENumAssHS: any = "";
  isCumMaint: any = "2";
  isCumShared: any = "2";
  assetItemPrepBy: any = "1";
  acSesStartMonth: any = "";
  // section-6 end
  // section-7 start
  // Only for Private Unaided Schools 
  noChildEnrolled: any = "";
  noOfStCnt: any = "";
  totStRTEcls1B: any = "";
  totStRTEcls1G: any = "";
  totStRTEcls1T: any = "";
  totStRTEcls1CWSNB: any = "";
  totStRTEcls1CWSNG: any = "";
  totStRTEcls1CWSNT: any = "";
  totStRTEcls2B: any = "";
  totStRTEcls2G: any = "";
  totStRTEcls2T: any = "";
  totStRTEcls3B: any = "";
  totStRTEcls3G: any = "";
  totStRTEcls3T: any = "";
  totStRTEcls4B: any = "";
  totStRTEcls4G: any = "";
  totStRTEcls4T: any = "";
  totStRTEcls5B: any = "";
  totStRTEcls5G: any = "";
  totStRTEcls5T: any = "";
  totStRTEcls6B: any = "";
  totStRTEcls6G: any = "";
  totStRTEcls6T: any = "";
  totStRTEcls7B: any = "";
  totStRTEcls7G: any = "";
  totStRTEcls7T: any = "";
  totStRTEcls8B: any = "";
  totStRTEcls8G: any = "";
  totStRTEcls8T: any = "";
  totStRTEcls9B: any = "";
  totStRTEcls9G: any = "";
  totStRTEcls9T: any = "";
  totStRTEcls10B: any = "";
  totStRTEcls10G: any = "";
  totStRTEcls10T: any = "";
  totStRTEcls11B: any = "";
  totStRTEcls11G: any = "";
  totStRTEcls11T: any = "";
  totStRTEcls12B: any = "";
  totStRTEcls12G: any = "";
  totStRTEcls12T: any = "";

  totStEWScls1B: any = "";
  totStEWScls1G: any = "";
  totStEWScls1T: any = "";
  totStEWScls2B: any = "";
  totStEWScls2G: any = "";
  totStEWScls2T: any = "";
  totStEWScls3B: any = "";
  totStEWScls3G: any = "";
  totStEWScls3T: any = "";
  totStEWScls4B: any = "";
  totStEWScls4G: any = "";
  totStEWScls4T: any = "";
  totStEWScls5B: any = "";
  totStEWScls5G: any = "";
  totStEWScls5T: any = "";
  totStEWScls6B: any = "";
  totStEWScls6G: any = "";
  totStEWScls6T: any = "";
  totStEWScls7B: any = "";
  totStEWScls7G: any = "";
  totStEWScls7T: any = "";
  totStEWScls8B: any = "";
  totStEWScls8G: any = "";
  totStEWScls8T: any = "";
  totStEWScls9B: any = "";
  totStEWScls9G: any = "";
  totStEWScls9T: any = "";
  totStEWScls10B: any = "";
  totStEWScls10G: any = "";
  totStEWScls10T: any = "";
  totStEWScls11B: any = "";
  totStEWScls11G: any = "";
  totStEWScls11T: any = "";
  totStEWScls12B: any = "";
  totStEWScls12G: any = "";
  totStEWScls12T: any = "";
  // section-7 end
  // section-8 start
  // Only for Government and Government Aided Schools 
  isAngloc: any = "2";
  angCode: any = "";
  totChildAngB: any = "";
  totChildAngG: any = "";
  totChildAngT: any = "";
  isAngTrained: any = "2";
  isAngEdu: any = "2";
  isBalvatikaSt: any = "2";
// section-8 end
// section-9 start
  isOutChidSpTraining: any = "2";
  totSpTrErCurB: any = "";
  totSpTrErCurG: any = "";
  totSpTrErCurT: any = "";
  totSpTrErPreB: any = "";
  totSpTrErPreG: any = "";
  totSpTrErPreT: any = "";
  totSpTrComPreB: any = "";
  totSpTrComPreG: any = "";
  totSpTrComPreT: any = "";
  authSpTraing: any = "";
  plcSpTraingCond: any = "";
  typeTrainingCond: any = "";
  totStAtRemedialTeacCurYr: any = "";
  totStLearningEnhCls: any = "";
// section-9 end
// section-10 start
toVisitPrev: any = "";
toVisitCRCPrev: any = "";
toVisitBRCPrev: any = "";
toVisitStatePrev: any = "";
toVisitClusterJNV: any = "";
toVisiRegionJNV: any = "";
toVisiHQNV: any = "";
// section-10 end
// section-11 start
  isSMC: any = "2";
  isSDMC: any = "2";
  meetSmdcCon: any = "";
  isSMCDevPlan: any = "2";
  SMCDevPlanYear: any = "";
  isSBC: any = "2";
  isAC: any = "2";
  isPTA: any = "2";
  totPTAMeetingsCuYr: any = "";
  isScMultiClass: any = "2";
  totClassMultiClass: any = "";
  totStudentAttendMultiClass: any = "";
  isSchoolComplex: any = "2";
  isSchoolComplexHUB: any = "2";
  totSchoolComplextPM: any = "";
  totSchoolComplextUP: any = "";
  totSchoolComplextSC: any = "";
  totSchoolComplextHS: any = "";
  totSchoolComplext: any = "";
  // section-11 end
  // Availability of free Textbooks, Teaching Learning Material (TLM) and play material (in current academic year)
  // Whether complete set of free textbooks received
  isTextBookRecievedPM: any = "";
  isTextBookRecievedUP: any = "";
  isTextBookRecievedSC: any = "";
  isTextBookRecievedHS: any = "";
  // Whether complete set of free textbooks received
  //  When were the textbooks received in current academic year
  vchStartAcademicPM: any = "";
  vchStartAcademicUP: any = "";
  vchStartAcademicSC: any = "";
  vchStartAcademicHS: any = "";
  //  When were the textbooks received in current academic year
  //  Whether TLM available for each grade
  isTLMAvlPM: any = "";
  isTLMAvlUP: any = "";
  isTLMAvlSC: any = "";
  isTLMAvlHS: any = "";
  //  Whether TLM available for each grade
  // If Yes, number of children provided core TLM for Language
  totTLMLPM: any = "";
  totTLMLUP: any = "";
  totTLMLSC: any = "";
  totTLMLHS: any = "";
  // If Yes, number of children provided core TLM for Language
  // If Yes, number of children provided core TLM for Mathematics
  totTLMPM: any = "";
  totTLMUP: any = "";
  totTLMSC: any = "";
  totTLMHS: any = "";
  // If Yes, number of children provided core TLM for Mathematics
  // Whether the School has received graded supplementary material in previous academic year
  gradSupMatPM: any = "";
  gradSupMatUP: any = "";
  gradSupMatSC: any = "";
  gradSupMatHS: any = "";
  // Whether the School has received graded supplementary material in previous academic year
  // If Yes, number of children provided Graded Supplementary Material
  cPGDmatPM: any = "";
  cPGDmatUP: any = "";
  cPGDmatSC: any = "";
  cPGDmatHS: any = "";
  // If Yes, number of children provided Graded Supplementary Material
  // Number of children having access to Supplementary graded material in school
  cAGDmatPM: any = "";
  cAGDmatUP: any = "";
  cAGDmatSC: any = "";
  cAGDmatHS: any = "";
  // Number of children having access to Supplementary graded material in school
  //  Number of books in the school library
  bookSchPM: any = "";
  bookSchUP: any = "";
  bookSchSC: any = "";
  bookSchHS: any = "";
  //  Number of books in the school library
  // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
  noBookBarowChildPM: any = "";
  noBookBarowChildUP: any = "";
  noBookBarowChildSC: any = "";
  noBookBarowChildHS: any = "";
  // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
  // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
  noPaternalCommBySchPM: any = "";
  noPaternalCommBySchUP: any = "";
  noPaternalCommBySchSC: any = "";
  noPaternalCommBySchHS: any = "";
  // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
  // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
  parentsInvSupFlnPM: any = "";
  parentsInvSupFlnUP: any = "";
  parentsInvSupFlnSC: any = "";
  parentsInvSupFlnHS: any = "";
  // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
  // Whether the school has introduced peer learning
  schPeerLrnPM: any = "";
  schPeerLrnUP: any = "";
  schPeerLrnSC: any = "";
  schPeerLrnHS: any = "";
  // Whether the school has introduced peer learning
  // Whether play material, games and sports equipment available for each grade
  isSportEquipPM: any = "";
  isSportEquipUP: any = "";
  isSportEquipSC: any = "";
  isSportEquipHS: any = "";
  // Whether play material, games and sports equipment available for each grade

  // key indicator start
  // Number of learning outcome based assessment items created in total start
  noLernOutcmAssemnt1: any = "";
  noLernOutcmAssemnt2: any = "";
  noLernOutcmAssemnt3: any = "";
  noLernOutcmAssemnt4: any = "";
  noLernOutcmAssemnt5: any = "";
  noLernOutcmAssemnt6: any = "";
  noLernOutcmAssemnt7: any = "";
  noLernOutcmAssemnt8: any = "";
  noLernOutcmAssemnt9: any = "";
  noLernOutcmAssemnt10: any = "";
  noLernOutcmAssemnt11: any = "";
  noLernOutcmAssemnt12: any = "";
  // Number of learning outcome based assessment items created in total end
  // Number of criterionreferenced items created in Previous Academic Year start
  noCreatPrevYear1: any = "";
  noCreatPrevYear2: any = "";
  noCreatPrevYear3: any = "";
  noCreatPrevYear4: any = "";
  noCreatPrevYear5: any = "";
  noCreatPrevYear6: any = "";
  noCreatPrevYear7: any = "";
  noCreatPrevYear8: any = "";
  noCreatPrevYear9: any = "";
  noCreatPrevYear10: any = "";
  noCreatPrevYear11: any = "";
  noCreatPrevYear12: any = "";
  // Number of criterionreferenced items created in Previous Academic Year end
  // Whether school teachers of this school created teaching aids/tools for teaching learning start
  schTchCrtTchAid1: any = "";
  schTchCrtTchAid2: any = "";
  schTchCrtTchAid3: any = "";
  schTchCrtTchAid4: any = "";
  schTchCrtTchAid5: any = "";
  schTchCrtTchAid6: any = "";
  schTchCrtTchAid7: any = "";
  schTchCrtTchAid8: any = "";
  schTchCrtTchAid9: any = "";
  schTchCrtTchAid10: any = "";
  schTchCrtTchAid11: any = "";
  schTchCrtTchAid12: any = "";
  // Whether school teachers of this school created teaching aids/tools for teaching learning end
  // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
  schActiveUndertake1: any = "";
  schActiveUndertake2: any = "";
  schActiveUndertake3: any = "";
  schActiveUndertake4: any = "";
  schActiveUndertake5: any = "";
  schActiveUndertake6: any = "";
  schActiveUndertake7: any = "";
  schActiveUndertake8: any = "";
  schActiveUndertake9: any = "";
  schActiveUndertake10: any = "";
  schActiveUndertake11: any = "";
  schActiveUndertake12: any = "";
  // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc end
  //  Total Number of HardSpots identified in Learning outcomes start
  totalNoHardspot1: any = "";
  totalNoHardspot2: any = "";
  totalNoHardspot3: any = "";
  totalNoHardspot4: any = "";
  totalNoHardspot5: any = "";
  totalNoHardspot6: any = "";
  totalNoHardspot7: any = "";
  totalNoHardspot8: any = "";
  totalNoHardspot9: any = "";
  totalNoHardspot10: any = "";
  totalNoHardspot11: any = "";
  totalNoHardspot12: any = "";
  // Total Number of HardSpots identified in Learning outcomes end
  // Number of students received orientation on cyber safety start
  totalNoOrientation1: any = "";
  totalNoOrientation2: any = "";
  totalNoOrientation3: any = "";
  totalNoOrientation4: any = "";
  totalNoOrientation5: any = "";
  totalNoOrientation6: any = "";
  totalNoOrientation7: any = "";
  totalNoOrientation8: any = "";
  totalNoOrientation9: any = "";
  totalNoOrientation10: any = "";
  totalNoOrientation11: any = "";
  totalNoOrientation12: any = "";
  // Number of students received orientation on cyber safety end
  // Number of students received training on psycho-social aspects start
  totalNoRecvTrnPsyco1: any = "";
  totalNoRecvTrnPsyco2: any = "";
  totalNoRecvTrnPsyco3: any = "";
  totalNoRecvTrnPsyco4: any = "";
  totalNoRecvTrnPsyco5: any = "";
  totalNoRecvTrnPsyco6: any = "";
  totalNoRecvTrnPsyco7: any = "";
  totalNoRecvTrnPsyco8: any = "";
  totalNoRecvTrnPsyco9: any = "";
  totalNoRecvTrnPsyco10: any = "";
  totalNoRecvTrnPsyco11: any = "";
  totalNoRecvTrnPsyco12: any = "";
  // Number of students received training on psycho-social aspects end

  other_Medium: boolean = false;
  other_Language: boolean = false;
  editTime: boolean = false;
  moi: any = "";
  selected: any;
  selectedItems: any = "";
  selectedValues: any = "";
  userProfile: any = [];
  userId:any="";
  /* new chnages protype form controls :: End */
  constructor(
    private router: ActivatedRoute,
    public route: Router,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    public schoolService: SchoolService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonService: CommonserviceService,
    public commonFunctionHelper: CommonFunctionHelper,
  ) {}

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.initializeForm();
    this.loadAnnexturesDataBySeq();
    this.getMaxAndMinClassAndMgmt(this.encId, this.academicYear);
    // this.dropdownSettings = {
    //   idField: "anxtValue",
    //   textField: "anxtName",
    //   enableCheckAll: true,
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   noDataAvailablePlaceholderText: "No data available",
    //   allowSearchFilter: true,
    //   itemsShowLimit: 3,
    //   singleSelection: false,
    // };

    // this.dropdownSettings1 = {
    //   idField: "anxtValue",
    //   textField: "anxtName",
    //   enableCheckAll: true,
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   noDataAvailablePlaceholderText: "No data available",
    //   allowSearchFilter: true,
    //   itemsShowLimit: 3,
    // };
  }
 
  initializeForm() {
    this.schoolOtherInfoForm = this.formBuilder.group({
      encId: [this.encId],
      academicYear: [this.academicYear],
      draftStatus: [this.draftStatus],
      userId: [this.userId],

      // section-1
      isPrePrimaryAttached: [this.isPrePrimaryAttached, Validators.required],
      streamAvailForArts: [this.streamAvailForArts],
      streamAvailForScience: [this.streamAvailForScience],
      streamAvailForCommerce: [this.streamAvailForCommerce],
      streamAvailForVocational: [this.streamAvailForVocational],
      streamAvailForOther: [this.streamAvailForOther],
      noOfSecCls1: [
        this.noOfSecCls1,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls2: [
        this.noOfSecCls2,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls3: [
        this.noOfSecCls3,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls4: [
        this.noOfSecCls4,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls5: [
        this.noOfSecCls5,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls6: [
        this.noOfSecCls6,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls7: [
        this.noOfSecCls7,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls8: [
        this.noOfSecCls8,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls9: [
        this.noOfSecCls9,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls10: [
        this.noOfSecCls10,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls11: [
        this.noOfSecCls11,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSecCls12: [
        this.noOfSecCls12,
        [Validators.maxLength(2), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // section-1 end
      // section-2 start
      yearOfEstd: [
        this.yearOfEstd,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ], //new add
      recogYearOfP: [
        this.recogYearOfP,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      recogYearOfUP: [
        this.recogYearOfUP,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      recogYearOfS: [
        this.recogYearOfS,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      recogYearOfHS: [
        this.recogYearOfHS,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      yearOfUpgradePtoUP: [
        this.yearOfUpgradePtoUP,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      yearOfUpgradeUPtoS: [
        this.yearOfUpgradeUPtoS,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      yearOfUpgradeStoHS: [
        this.yearOfUpgradeStoHS,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // section-2 end
      // section-3 start
      isSpecialschCWSN: [this.isSpecialschCWSN, Validators.required],
      specialSchType: [this.specialSchType],
      isShiftsch: [this.isShiftsch, Validators.required],
      runSkillTrainingCenter: [
        this.runSkillTrainingCenter,
        Validators.required,
      ],
      isResidentalsch: [this.isResidentalsch, Validators.required],
      residentialCategory: [
        this.residentialCategory,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residentalSchType: [
        this.residentalSchType,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls6Boys: [
        this.residSchSeatsCls6Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls6Girls: [
        this.residSchSeatsCls6Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls7Boys: [
        this.residSchSeatsCls7Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls7Girls: [
        this.residSchSeatsCls7Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls8Boys: [
        this.residSchSeatsCls8Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls8Girls: [
        this.residSchSeatsCls8Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls9Boys: [
        this.residSchSeatsCls9Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls9Girls: [
        this.residSchSeatsCls9Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls10Boys: [
        this.residSchSeatsCls10Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls10Girls: [
        this.residSchSeatsCls10Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls11Boys: [
        this.residSchSeatsCls11Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls11Girls: [
        this.residSchSeatsCls11Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls12Boys: [
        this.residSchSeatsCls12Boys,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      residSchSeatsCls12Girls: [
        this.residSchSeatsCls12Girls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isHostle: [this.isHostle],
      hostleType: [this.hostleType],
      boardingU: [this.boardingU],
      boardingUBoys: [
        this.boardingUBoys,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingUGirls: [
        this.boardingUGirls,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingUTrans: [
        this.boardingUTrans,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingUP: [this.boardingUP],
      boardingUPBoys: [
        this.boardingUPBoys,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingUPGirls: [
        this.boardingUPGirls,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingUPTrans: [
        this.boardingUPTrans,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingS: [this.boardingS],
      boardingSBoys: [
        this.boardingSBoys,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingSGirls: [
        this.boardingSGirls,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingSTrans: [
        this.boardingSTrans,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingHS: [this.boardingHS],
      boardingHSBoys: [
        this.boardingHSBoys,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingHSGirls: [
        this.boardingHSGirls,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      boardingHSTrans: [
        this.boardingHSTrans,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isMinorityManagedSch: [this.isMinorityManagedSch, Validators.required],
      minorityType: [this.minorityType],
      // section-3 end
      // Affiliation Board of school start
      afSCSec: [this.afSCSec],
      afNum: [
        this.afNum,
        [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(20)],
      ],
      afSCOthBoard: [
        this.afSCOthBoard,
        [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(80)],
      ],
      afHSSec: [this.afHSSec],
      afHSNum: [
        this.afHSNum,
        [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(20)],
      ],
      afHSOthBoard: [
        this.afHSOthBoard,
        [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(80)],
      ],
      // Affiliation Board of school end
      // section-4 start
      isTaughtMotherTongue: [this.isTaughtMotherTongue],
      // mediumOfInstructions: ["", Validators.required],
      // mediumOfInstructionsOth: [
      //   this.mediumOfInstructionsOth,
      //   [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(20)],
      // ],
      // languagesTaught: [this.languagesTaught, Validators.required],
      // otherLanguagesTaught: [
      //   this.otherLanguagesTaught,
      //   [Validators.maxLength(80), Validators.pattern(/^[a-zA-Z0-9 ]*$/)],
      // ],
      languagesTaughtClas: [
        this.languagesTaughtClas,
        [Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), Validators.maxLength(20)],
      ],
      stdTLangBoys: [
        this.stdTLangBoys,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      stdTLangGirl: [
        this.stdTLangGirl,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      stdTLangTrans: [
        this.stdTLangTrans,
        [Validators.maxLength(5), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isPreVocUP: [this.isPreVocUP],
      isProvVocEdu: [this.isProvVocEdu],
      // section-4 end
      // section-5 start
      // Distance of the school (in km.) from the nearest Govt./Aided school
      distSchPM: [
        this.distSchPM,
        [Validators.maxLength(5), Validators.pattern(/^\d+\.?\d{0,2}$/)],
      ],
      distSchUP: [
        this.distSchUP,
        [Validators.maxLength(5), Validators.pattern(/^\d+\.?\d{0,2}$/)],
      ],
      distSchSC: [
        this.distSchSC,
        [Validators.maxLength(5), Validators.pattern(/^\d+\.?\d{0,2}$/)],
      ],
      distSchHS: [
        this.distSchHS,
        [Validators.maxLength(5), Validators.pattern(/^\d+\.?\d{0,2}$/)],
      ],
      isSchApprochRoad: [this.isSchApprochRoad],
      // Number of instructional days (previous academic year)
      numInsDayPM: [
        this.numInsDayPM,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(365),
        ],
      ],
      numInsDayUP: [
        this.numInsDayUP,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(365),
        ],
      ],
      numInsDaySC: [
        this.numInsDaySC,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(365),
        ],
      ],
      numInsDayHS: [
        this.numInsDayHS,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(365),
        ],
      ],
      // Average school hours for children (per day) - Number of hours children stay in school
      avgChHrPM: [
        this.avgChHrPM,
        [
          Validators.maxLength(2),
          Validators.max(24),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      avgChHrUP: [
        this.avgChHrUP,
        [
          Validators.maxLength(2),
          Validators.max(24),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      avgChHrSC: [
        this.avgChHrSC,
        [
          Validators.maxLength(2),
          Validators.max(24),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      avgChHrHS: [
        this.avgChHrHS,
        [
          Validators.maxLength(2),
          Validators.max(24),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      // Average working hours for Teachers (per day) - Number of hours teachers stay in school
      avgTHrPM: [
        this.avgTHrPM,
        [
          Validators.maxLength(2),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(24),
        ],
      ],
      avgTHrUP: [
        this.avgTHrUP,
        [
          Validators.maxLength(2),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(24),
        ],
      ],
      avgTHrSC: [
        this.avgTHrSC,
        [
          Validators.maxLength(2),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(24),
        ],
      ],
      avgTHrHS: [
        this.avgTHrHS,
        [
          Validators.maxLength(2),
          Validators.pattern(/^[0-9]\d*$/),
          Validators.max(24),
        ],
      ],
      // section-5 end
      // section-6 start
      isCCESch: [this.isCCESch],
      isCCEPM: [this.isCCEPM],
      isCCENumAssPM: [
        this.isCCENumAssPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isCCEUP: [this.isCCEUP],
      isCCENumAssUP: [
        this.isCCENumAssUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isCCESC: [this.isCCESC],
      isCCENumAssSC: [
        this.isCCENumAssSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isCCEHS: [this.isCCEHS],
      isCCENumAssHS: [
        this.isCCENumAssHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      isCumMaint: [this.isCumMaint],
      isCumShared: [this.isCumShared],
      assetItemPrepBy: [this.assetItemPrepBy],
      acSesStartMonth: [this.acSesStartMonth],
      // section-6 end
      // section-7 start
      // Only for Private Unaided Schools 
      noChildEnrolled: [
        this.noChildEnrolled,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfStCnt: [
        this.noOfStCnt,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totStRTEcls1B: [
        this.totStRTEcls1B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls1G: [
        this.totStRTEcls1G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls1T: [
        this.totStRTEcls1T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls1CWSNB: [
        this.totStRTEcls1CWSNB,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls1CWSNG: [
        this.totStRTEcls1CWSNG,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls1CWSNT: [
        this.totStRTEcls1CWSNT,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls2B: [
        this.totStRTEcls2B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls2G: [
        this.totStRTEcls2G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls2T: [
        this.totStRTEcls2T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls3B: [
        this.totStRTEcls3B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls3G: [
        this.totStRTEcls3G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls3T: [
        this.totStRTEcls3T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls4B: [
        this.totStRTEcls4B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls4G: [
        this.totStRTEcls4G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls4T: [
        this.totStRTEcls4T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls5B: [
        this.totStRTEcls5B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls5G: [
        this.totStRTEcls5G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls5T: [
        this.totStRTEcls5T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls6B: [
        this.totStRTEcls6B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls6G: [
        this.totStRTEcls6G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls6T: [
        this.totStRTEcls6T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls7B: [
        this.totStRTEcls7B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls7G: [
        this.totStRTEcls7G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls7T: [
        this.totStRTEcls7T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls8B: [
        this.totStRTEcls8B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls8G: [
        this.totStRTEcls8G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStRTEcls8T: [
        this.totStRTEcls8T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totStEWScls1B: [
        this.totStEWScls1B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls1G: [
        this.totStEWScls1G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls1T: [
        this.totStEWScls1T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls2B: [
        this.totStEWScls2B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls2G: [
        this.totStEWScls2G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls2T: [
        this.totStEWScls2T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls3B: [
        this.totStEWScls3B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls3G: [
        this.totStEWScls3G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls3T: [
        this.totStEWScls3T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls4B: [
        this.totStEWScls4B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls4G: [
        this.totStEWScls4G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls4T: [
        this.totStEWScls4T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls5B: [
        this.totStEWScls5B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls5G: [
        this.totStEWScls5G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls5T: [
        this.totStEWScls5T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls6B: [
        this.totStEWScls6B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls6G: [
        this.totStEWScls6G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls6T: [
        this.totStEWScls6T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls7B: [
        this.totStEWScls7B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls7G: [
        this.totStEWScls7G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls7T: [
        this.totStEWScls7T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls8B: [
        this.totStEWScls8B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls8G: [
        this.totStEWScls8G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls8T: [
        this.totStEWScls8T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls9B: [
        this.totStEWScls9B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls9G: [
        this.totStEWScls9G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls9T: [
        this.totStEWScls9T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls10B: [
        this.totStEWScls10B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls10G: [
        this.totStEWScls10G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls10T: [
        this.totStEWScls10T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls11B: [
        this.totStEWScls11B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls11G: [
        this.totStEWScls11G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls11T: [
        this.totStEWScls11T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls12B: [
        this.totStEWScls12B,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls12G: [
        this.totStEWScls12G,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStEWScls12T: [
        this.totStEWScls12T,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // section-7 end
      // section-8 start
      isAngloc: [this.isAngloc],
      angCode: [this.angCode, Validators.maxLength(40)],
      totChildAngB: [
        this.totChildAngB,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totChildAngG: [
        this.totChildAngG,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totChildAngT: [
        this.totChildAngT,
        [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
      ], 
      isAngTrained: [this.isAngTrained],
      isAngEdu: [this.isAngEdu],
      isBalvatikaSt: [this.isBalvatikaSt],
      // section-8 end
      // section-9 start
      isOutChidSpTraining: [this.isOutChidSpTraining],
      totSpTrErCurB: [
        this.totSpTrErCurB,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totSpTrErCurG: [
        this.totSpTrErCurG,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totSpTrErCurT: [
        this.totSpTrErCurT,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], 

      totSpTrErPreB: [
        this.totSpTrErPreB,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totSpTrErPreG: [
        this.totSpTrErPreG,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totSpTrErPreT: [
        this.totSpTrErPreT,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], 
      totSpTrComPreB: [
        this.totSpTrComPreB,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totSpTrComPreG: [
        this.totSpTrComPreG,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],

      totSpTrComPreT: [
        this.totSpTrComPreT,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      authSpTraing: [this.authSpTraing],
      plcSpTraingCond: [this.plcSpTraingCond],
      typeTrainingCond: [this.typeTrainingCond],

      totStAtRemedialTeacCurYr: [
        this.totStAtRemedialTeacCurYr,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totStLearningEnhCls: [
        this.totStLearningEnhCls,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // section-9 end
      // section-10 start
// Details of visits to the school during the previous academic year 
toVisitPrev: [
  this.toVisitPrev,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
toVisitCRCPrev: [
  this.toVisitCRCPrev,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
toVisitBRCPrev: [
  this.toVisitBRCPrev,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
toVisitStatePrev: [
  this.toVisitStatePrev,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
// For JNV/KV/Other Central Government Schools 
toVisitClusterJNV: [
  this.toVisitClusterJNV,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
toVisiRegionJNV: [
  this.toVisiRegionJNV,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
toVisiHQNV: [
  this.toVisiHQNV,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
// section-10 end
// section- 11 start 
isSMC: [this.isSMC],
isSDMC: [this.isSDMC],
meetSmdcCon: [
  this.meetSmdcCon,
  [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
],
isSMCDevPlan: [this.isSMCDevPlan],
SMCDevPlanYear: [
  this.SMCDevPlanYear,
  [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
],
isSBC: [this.isSBC],
isAC: [this.isAC],
isPTA: [this.isPTA],
totPTAMeetingsCuYr: [
  this.totPTAMeetingsCuYr,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
isScMultiClass: [this.isScMultiClass],

totClassMultiClass: [
  this.totClassMultiClass,
  [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
],
totStudentAttendMultiClass: [
  this.totStudentAttendMultiClass,
  [Validators.maxLength(4), Validators.pattern(/^[0-9]\d*$/)],
],

isSchoolComplex: [this.isSchoolComplex],
isSchoolComplexHUB: [this.isSchoolComplexHUB],
totSchoolComplextPM: [
  this.totSchoolComplextPM,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
totSchoolComplextUP: [
  this.totSchoolComplextUP,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
totSchoolComplextSC: [
  this.totSchoolComplextSC,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
totSchoolComplextHS: [
  this.totSchoolComplextHS,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
totSchoolComplext: [
  this.totSchoolComplext,
  [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
],
// section-11 end
// section-12 start
      // Availability of free Textbooks, Teaching Learning Material (TLM) and play material (in current academic year)
      // Whether complete set of free textbooks received
      // isTextBookRecievedPrePM: [this.isTextBookRecievedPrePM],
      isTextBookRecievedPM: [this.isTextBookRecievedPM],
      isTextBookRecievedUP: [this.isTextBookRecievedUP],
      isTextBookRecievedSC: [this.isTextBookRecievedSC],
      isTextBookRecievedHS: [this.isTextBookRecievedHS],
      // Whether complete set of free textbooks received
      //  When were the textbooks received in current academic year
      vchStartAcademicPM: [this.vchStartAcademicPM],
      vchStartAcademicUP: [this.vchStartAcademicUP],
      vchStartAcademicSC: [this.vchStartAcademicSC],
      vchStartAcademicHS: [this.vchStartAcademicHS],
      //  When were the textbooks received in current academic year
      //  Whether TLM available for each grade
      isTLMAvlPM: [this.isTLMAvlPM],
      isTLMAvlUP: [this.isTLMAvlUP],
      isTLMAvlSC: [this.isTLMAvlSC],
      isTLMAvlHS: [this.isTLMAvlHS],
      //  Whether TLM available for each grade
      // If Yes, number of children provided core TLM for Language
      totTLMLPM: [
        this.totTLMLPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMLUP: [
        this.totTLMLUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMLSC: [
        this.totTLMLSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMLHS: [
        this.totTLMLHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // If Yes, number of children provided core TLM for Language
      // If Yes, number of children provided core TLM for Mathematics
      totTLMPM: [
        this.totTLMPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMUP: [
        this.totTLMUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMSC: [
        this.totTLMSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totTLMHS: [
        this.totTLMHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // If Yes, number of children provided core TLM for Mathematics
      // Whether the School has received graded supplementary material in previous academic year
      gradSupMatPM: [
        this.gradSupMatPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      gradSupMatUP: [
        this.gradSupMatUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      gradSupMatSC: [
        this.gradSupMatSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      gradSupMatHS: [
        this.gradSupMatHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Whether the School has received graded supplementary material in previous academic year
      // If Yes, number of children provided Graded Supplementary Material
      cPGDmatPM: [
        this.cPGDmatPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], // new add
      cPGDmatUP: [
        this.cPGDmatUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], // new add
      cPGDmatSC: [
        this.cPGDmatSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], // new add
      cPGDmatHS: [
        this.cPGDmatHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ], // new add
      // If Yes, number of children provided Graded Supplementary Material
      // Number of children having access to Supplementary graded material in school
      cAGDmatPM: [
        this.cAGDmatPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      cAGDmatUP: [
        this.cAGDmatUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      cAGDmatSC: [
        this.cAGDmatSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      cAGDmatHS: [
        this.cAGDmatHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of children having access to Supplementary graded material in school
      //  Number of books in the school library
      bookSchPM: [
        this.bookSchPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      bookSchUP: [
        this.bookSchUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      bookSchSC: [
        this.bookSchSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      bookSchHS: [
        this.bookSchHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      //  Number of books in the school library
      // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
      noBookBarowChildPM: [
        this.noBookBarowChildPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noBookBarowChildUP: [
        this.noBookBarowChildUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noBookBarowChildSC: [
        this.noBookBarowChildSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noBookBarowChildHS: [
        this.noBookBarowChildHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
      // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
      noPaternalCommBySchPM: [
        this.noPaternalCommBySchPM,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noPaternalCommBySchUP: [
        this.noPaternalCommBySchUP,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noPaternalCommBySchSC: [
        this.noPaternalCommBySchSC,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noPaternalCommBySchHS: [
        this.noPaternalCommBySchHS,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
      // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
      parentsInvSupFlnPM: [this.parentsInvSupFlnPM],
      parentsInvSupFlnUP: [this.parentsInvSupFlnUP],
      parentsInvSupFlnSC: [this.parentsInvSupFlnSC],
      parentsInvSupFlnHS: [this.parentsInvSupFlnHS],
      // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
      // Whether the school has introduced peer learning
      schPeerLrnPM: [this.schPeerLrnPM],
      schPeerLrnUP: [this.schPeerLrnUP],
      schPeerLrnSC: [this.schPeerLrnSC],
      schPeerLrnHS: [this.schPeerLrnHS],
      // Whether the school has introduced peer learning
      // Whether play material, games and sports equipment available for each grade
      isSportEquipPM: [this.isSportEquipPM],
      isSportEquipUP: [this.isSportEquipUP],
      isSportEquipSC: [this.isSportEquipSC],
      isSportEquipHS: [this.isSportEquipHS],
      // Whether play material, games and sports equipment available for each grade

      // section-12 end
       // section-13 start
      //key indicators
      // Number of learning outcome based assessment items created in total start
      noLernOutcmAssemnt1: [
        this.noLernOutcmAssemnt1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt2: [
        this.noLernOutcmAssemnt2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt3: [
        this.noLernOutcmAssemnt3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt4: [
        this.noLernOutcmAssemnt4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt5: [
        this.noLernOutcmAssemnt5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt6: [
        this.noLernOutcmAssemnt6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt7: [
        this.noLernOutcmAssemnt7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt8: [
        this.noLernOutcmAssemnt8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt9: [
        this.noLernOutcmAssemnt9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt10: [
        this.noLernOutcmAssemnt10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt11: [
        this.noLernOutcmAssemnt11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noLernOutcmAssemnt12: [
        this.noLernOutcmAssemnt12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of learning outcome based assessment items created in total end
      // Number of criterionreferenced items created in Previous Academic Year start
      noCreatPrevYear1: [
        this.noCreatPrevYear1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear2: [
        this.noCreatPrevYear2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear3: [
        this.noCreatPrevYear3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear4: [
        this.noCreatPrevYear4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear5: [
        this.noCreatPrevYear5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear6: [
        this.noCreatPrevYear6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear7: [
        this.noCreatPrevYear7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear8: [
        this.noCreatPrevYear8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear9: [
        this.noCreatPrevYear9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear10: [
        this.noCreatPrevYear10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear11: [
        this.noCreatPrevYear11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noCreatPrevYear12: [
        this.noCreatPrevYear12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of criterionreferenced items created in Previous Academic Year start
      // Whether school teachers of this school created teaching aids/tools for teaching learning start
      schTchCrtTchAid1: [
        this.schTchCrtTchAid1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid2: [
        this.schTchCrtTchAid2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid3: [
        this.schTchCrtTchAid3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid4: [
        this.schTchCrtTchAid4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid5: [
        this.schTchCrtTchAid5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid6: [
        this.schTchCrtTchAid6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid7: [
        this.schTchCrtTchAid7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid8: [
        this.schTchCrtTchAid8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid9: [
        this.schTchCrtTchAid9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid10: [
        this.schTchCrtTchAid10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid11: [
        this.schTchCrtTchAid11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schTchCrtTchAid12: [
        this.schTchCrtTchAid12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Whether school teachers of this school created teaching aids/tools for teaching learning end
      // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
      schActiveUndertake1: [
        this.schActiveUndertake1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake2: [
        this.schActiveUndertake2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake3: [
        this.schActiveUndertake3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake4: [
        this.schActiveUndertake4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake5: [
        this.schActiveUndertake5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake6: [
        this.schActiveUndertake6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake7: [
        this.schActiveUndertake7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake8: [
        this.schActiveUndertake8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake9: [
        this.schActiveUndertake9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake10: [
        this.schActiveUndertake10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake11: [
        this.schActiveUndertake11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      schActiveUndertake12: [
        this.schActiveUndertake12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
      // Total Number of HardSpots identified in Learning outcomes start
      totalNoHardspot1: [
        this.totalNoHardspot1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot2: [
        this.totalNoHardspot2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot3: [
        this.totalNoHardspot3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot4: [
        this.totalNoHardspot4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot5: [
        this.totalNoHardspot5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot6: [
        this.totalNoHardspot6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot7: [
        this.totalNoHardspot7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot8: [
        this.totalNoHardspot8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot9: [
        this.totalNoHardspot9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot10: [
        this.totalNoHardspot10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot11: [
        this.totalNoHardspot11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoHardspot12: [
        this.totalNoHardspot12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Total Number of HardSpots identified in Learning outcomes end
      // Number of students received orientation on cyber safety start
      totalNoOrientation1: [
        this.totalNoOrientation1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation2: [
        this.totalNoOrientation2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation3: [
        this.totalNoOrientation3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation4: [
        this.totalNoOrientation4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation5: [
        this.totalNoOrientation5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation6: [
        this.totalNoOrientation6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation7: [
        this.totalNoOrientation7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation8: [
        this.totalNoOrientation8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation9: [
        this.totalNoOrientation9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation10: [
        this.totalNoOrientation10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation11: [
        this.totalNoOrientation11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoOrientation12: [
        this.totalNoOrientation12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of students received orientation on cyber safety end
      // Number of students received training on psycho-social aspects start
      totalNoRecvTrnPsyco1: [
        this.totalNoRecvTrnPsyco1,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco2: [
        this.totalNoRecvTrnPsyco2,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco3: [
        this.totalNoRecvTrnPsyco3,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco4: [
        this.totalNoRecvTrnPsyco4,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco5: [
        this.totalNoRecvTrnPsyco5,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco6: [
        this.totalNoRecvTrnPsyco6,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco7: [
        this.totalNoRecvTrnPsyco7,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco8: [
        this.totalNoRecvTrnPsyco8,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco9: [
        this.totalNoRecvTrnPsyco9,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco10: [
        this.totalNoRecvTrnPsyco10,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco11: [
        this.totalNoRecvTrnPsyco11,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalNoRecvTrnPsyco12: [
        this.totalNoRecvTrnPsyco12,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      // Number of students received training on psycho-social aspects end
 // section-13 end
    });
  }
  resetForm() {
    // section-1 start
    this.schoolOtherInfoForm.get("isPrePrimaryAttached")?.patchValue(this.isPrePrimaryAttached);
    this.schoolOtherInfoForm
      .get("streamAvailForArts")
      ?.patchValue(this.streamAvailForArts);
    this.schoolOtherInfoForm
      .get("streamAvailForScience")
      ?.patchValue(this.streamAvailForScience);
    this.schoolOtherInfoForm
      .get("streamAvailForCommerce")
      ?.patchValue(this.streamAvailForCommerce);
    this.schoolOtherInfoForm
      .get("streamAvailForVocational")
      ?.patchValue(this.streamAvailForVocational);
    this.schoolOtherInfoForm
      .get("streamAvailForOther")
      ?.patchValue(this.streamAvailForOther);
    this.schoolOtherInfoForm.get("noOfSecCls1")?.patchValue(this.noOfSecCls1);
    this.schoolOtherInfoForm.get("noOfSecCls2")?.patchValue(this.noOfSecCls2);
    this.schoolOtherInfoForm.get("noOfSecCls3")?.patchValue(this.noOfSecCls3);
    this.schoolOtherInfoForm.get("noOfSecCls4")?.patchValue(this.noOfSecCls4);
    this.schoolOtherInfoForm.get("noOfSecCls5")?.patchValue(this.noOfSecCls5);
    this.schoolOtherInfoForm.get("noOfSecCls6")?.patchValue(this.noOfSecCls6);
    this.schoolOtherInfoForm.get("noOfSecCls7")?.patchValue(this.noOfSecCls7);
    this.schoolOtherInfoForm.get("noOfSecCls8")?.patchValue(this.noOfSecCls8);
    this.schoolOtherInfoForm.get("noOfSecCls9")?.patchValue(this.noOfSecCls9);
    this.schoolOtherInfoForm.get("noOfSecCls10")?.patchValue(this.noOfSecCls10);
    this.schoolOtherInfoForm.get("noOfSecCls11")?.patchValue(this.noOfSecCls11);
    this.schoolOtherInfoForm.get("noOfSecCls12")?.patchValue(this.noOfSecCls12);
    // section-1 end
    // section-2 start
    this.schoolOtherInfoForm.get("yearOfEstd")?.patchValue(this.yearOfEstd);
    this.schoolOtherInfoForm.get("recogYearOfP")?.patchValue(this.recogYearOfP);
    this.schoolOtherInfoForm
      .get("recogYearOfUP")
      ?.patchValue(this.recogYearOfUP);
    this.schoolOtherInfoForm.get("recogYearOfS")?.patchValue(this.recogYearOfS);
    this.schoolOtherInfoForm
      .get("recogYearOfHS")
      ?.patchValue(this.recogYearOfHS);
    this.schoolOtherInfoForm
      .get("yearOfUpgradePtoUP")
      ?.patchValue(this.yearOfUpgradePtoUP);
    this.schoolOtherInfoForm
      .get("yearOfUpgradeUPtoS")
      ?.patchValue(this.yearOfUpgradeUPtoS);
    this.schoolOtherInfoForm
      .get("yearOfUpgradeStoHS")
      ?.patchValue(this.yearOfUpgradeStoHS);
    // section-2 end
    // section-3 start
    this.schoolOtherInfoForm
      .get("isSpecialschCWSN")
      ?.patchValue(this.isSpecialschCWSN);
    this.schoolOtherInfoForm
      .get("specialSchType")
      ?.patchValue(this.specialSchType);
    this.schoolOtherInfoForm.get("isShiftsch")?.patchValue(this.isShiftsch);
    this.schoolOtherInfoForm
      .get("runSkillTrainingCenter")
      ?.patchValue(this.runSkillTrainingCenter);
    this.schoolOtherInfoForm
      .get("isResidentalsch")
      ?.patchValue(this.isResidentalsch);
    this.schoolOtherInfoForm
      .get("residentialCategory")
      ?.patchValue(this.residentialCategory);
    this.schoolOtherInfoForm
      .get("residentalSchType")
      ?.patchValue(this.residentalSchType);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls6Boys")
      ?.patchValue(this.residSchSeatsCls6Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls7Boys")
      ?.patchValue(this.residSchSeatsCls7Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls8Boys")
      ?.patchValue(this.residSchSeatsCls8Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls9Boys")
      ?.patchValue(this.residSchSeatsCls9Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls10Boys")
      ?.patchValue(this.residSchSeatsCls10Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls11Boys")
      ?.patchValue(this.residSchSeatsCls11Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls12Boys")
      ?.patchValue(this.residSchSeatsCls12Boys);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls6Girls")
      ?.patchValue(this.residSchSeatsCls6Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls7Girls")
      ?.patchValue(this.residSchSeatsCls7Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls8Girls")
      ?.patchValue(this.residSchSeatsCls8Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls9Girls")
      ?.patchValue(this.residSchSeatsCls9Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls10Girls")
      ?.patchValue(this.residSchSeatsCls10Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls11Girls")
      ?.patchValue(this.residSchSeatsCls11Girls);
    this.schoolOtherInfoForm
      .get("residSchSeatsCls12Girls")
      ?.patchValue(this.residSchSeatsCls12Girls);
    this.schoolOtherInfoForm.get("isHostle")?.patchValue(this.isHostle);
    this.schoolOtherInfoForm.get("hostleType")?.patchValue(this.hostleType);
    this.schoolOtherInfoForm.get("boardingU")?.patchValue(this.boardingU);
    this.schoolOtherInfoForm
      .get("boardingUBoys")
      ?.patchValue(this.boardingUBoys);
    this.schoolOtherInfoForm
      .get("boardingUGirls")
      ?.patchValue(this.boardingUGirls);
    this.schoolOtherInfoForm
      .get("boardingUTrans")
      ?.patchValue(this.boardingUTrans);
    this.schoolOtherInfoForm.get("boardingUP")?.patchValue(this.boardingUP);
    this.schoolOtherInfoForm
      .get("boardingUPBoys")
      ?.patchValue(this.boardingUPBoys);
    this.schoolOtherInfoForm
      .get("boardingUPGirls")
      ?.patchValue(this.boardingUPGirls);
    this.schoolOtherInfoForm
      .get("boardingUPTrans")
      ?.patchValue(this.boardingUPTrans);
    this.schoolOtherInfoForm.get("boardingS")?.patchValue(this.boardingS);
    this.schoolOtherInfoForm
      .get("boardingSBoys")
      ?.patchValue(this.boardingSBoys);
    this.schoolOtherInfoForm
      .get("boardingSGirls")
      ?.patchValue(this.boardingSGirls);
    this.schoolOtherInfoForm
      .get("boardingSTrans")
      ?.patchValue(this.boardingSTrans);
    this.schoolOtherInfoForm.get("boardingHS")?.patchValue(this.boardingHS);
    this.schoolOtherInfoForm
      .get("boardingHSBoys")
      ?.patchValue(this.boardingHSBoys);
    this.schoolOtherInfoForm
      .get("boardingHSGirls")
      ?.patchValue(this.boardingHSGirls);
    this.schoolOtherInfoForm
      .get("boardingHSTrans")
      ?.patchValue(this.boardingHSTrans);
    this.schoolOtherInfoForm
      .get("isMinorityManagedSch")
      ?.patchValue(this.isMinorityManagedSch);
    this.schoolOtherInfoForm.get("minorityType")?.patchValue(this.minorityType);
    // section-3 end
    //Affiliation Board of school  end
    this.schoolOtherInfoForm.get("afSCSec")?.patchValue(this.afSCSec);
    this.schoolOtherInfoForm.get("afNum")?.patchValue(this.afNum);
    this.schoolOtherInfoForm.get("afSCOthBoard")?.patchValue(this.afSCOthBoard);
    this.schoolOtherInfoForm.get("afHSSec")?.patchValue(this.afHSSec);
    this.schoolOtherInfoForm.get("afHSNum")?.patchValue(this.afHSNum);
    this.schoolOtherInfoForm.get("afHSOthBoard")?.patchValue(this.afHSOthBoard);
    //Affiliation Board of school  end
    // section-4 start
    this.schoolOtherInfoForm
      .get("isTaughtMotherTongue")
      ?.patchValue(this.isTaughtMotherTongue);
    // this.schoolOtherInfoForm.get("mediumOfInstructions")?.patchValue(this.selectedItems);
    // this.schoolOtherInfoForm.get("mediumOfInstructionsOth")?.patchValue(this.mediumOfInstructionsOth);
    // this.schoolOtherInfoForm.get("languagesTaught")?.patchValue(this.selectedValues);
    // this.schoolOtherInfoForm.get("otherLanguagesTaught")?.patchValue(this.otherLanguagesTaught);
    this.schoolOtherInfoForm
      .get("languagesTaughtClas")
      ?.patchValue(this.languagesTaughtClas);
    this.schoolOtherInfoForm.get("stdTLangBoys")?.patchValue(this.stdTLangBoys);
    this.schoolOtherInfoForm.get("stdTLangGirl")?.patchValue(this.stdTLangGirl);
    this.schoolOtherInfoForm
      .get("stdTLangTrans")
      ?.patchValue(this.stdTLangTrans);
    this.schoolOtherInfoForm.get("isPreVocUP")?.patchValue(this.isPreVocUP);
    this.schoolOtherInfoForm.get("isProvVocEdu")?.patchValue(this.isProvVocEdu);
    // section-4 start
    // section-5 start
    // Distance of the school (in km.) from the nearest Govt./Aided school
    this.schoolOtherInfoForm.get("distSchPM")?.patchValue(this.distSchPM);
    this.schoolOtherInfoForm.get("distSchUP")?.patchValue(this.distSchUP);
    this.schoolOtherInfoForm.get("distSchSC")?.patchValue(this.distSchSC);
    this.schoolOtherInfoForm.get("distSchHS")?.patchValue(this.distSchHS);
    this.schoolOtherInfoForm
      .get("isSchApprochRoad")
      ?.patchValue(this.isSchApprochRoad);
    // Number of instructional days (previous academic year)
    this.schoolOtherInfoForm.get("numInsDayPM")?.patchValue(this.numInsDayPM);
    this.schoolOtherInfoForm.get("numInsDayUP")?.patchValue(this.numInsDayUP);
    this.schoolOtherInfoForm.get("numInsDaySC")?.patchValue(this.numInsDaySC);
    this.schoolOtherInfoForm.get("numInsDayHS")?.patchValue(this.numInsDayHS);
    // Average school hours for children (per day) - Number of hours children stay in school
    this.schoolOtherInfoForm.get("avgChHrPM")?.patchValue(this.avgChHrPM);
    this.schoolOtherInfoForm.get("avgChHrUP")?.patchValue(this.avgChHrUP);
    this.schoolOtherInfoForm.get("avgChHrSC")?.patchValue(this.avgChHrSC);
    this.schoolOtherInfoForm.get("avgChHrHS")?.patchValue(this.avgChHrHS);
    // Average working hours for Teachers (per day) - Number of hours teachers stay in school
    this.schoolOtherInfoForm.get("avgTHrPM")?.patchValue(this.avgTHrPM);
    this.schoolOtherInfoForm.get("avgTHrUP")?.patchValue(this.avgTHrUP);
    this.schoolOtherInfoForm.get("avgTHrSC")?.patchValue(this.avgTHrSC);
    this.schoolOtherInfoForm.get("avgTHrHS")?.patchValue(this.avgTHrHS);
    // section-5 end
    // section-6 start
    this.schoolOtherInfoForm.get("isCCESch")?.patchValue(this.isCCESch);
    this.schoolOtherInfoForm.get("isCCEPM")?.patchValue(this.isCCEPM);
    this.schoolOtherInfoForm
      .get("isCCENumAssPM")
      ?.patchValue(this.isCCENumAssPM);
    this.schoolOtherInfoForm.get("isCCEUP")?.patchValue(this.isCCEUP);
    this.schoolOtherInfoForm
      .get("isCCENumAssUP")
      ?.patchValue(this.isCCENumAssUP);
    this.schoolOtherInfoForm.get("isCCESC")?.patchValue(this.isCCESC);
    this.schoolOtherInfoForm
      .get("isCCENumAssSC")
      ?.patchValue(this.isCCENumAssSC);
    this.schoolOtherInfoForm.get("isCCEHS")?.patchValue(this.isCCEHS);
    this.schoolOtherInfoForm
      .get("isCCENumAssHS")
      ?.patchValue(this.isCCENumAssHS);
    this.schoolOtherInfoForm.get("isCumMaint")?.patchValue(this.isCumMaint);
    this.schoolOtherInfoForm.get("isCumShared")?.patchValue(this.isCumShared);
    this.schoolOtherInfoForm
      .get("assetItemPrepBy")
      ?.patchValue(this.assetItemPrepBy);
    this.schoolOtherInfoForm
      .get("acSesStartMonth")
      ?.patchValue(this.acSesStartMonth);
    // section-6 end
    // section-7 start
    // Only for Private Unaided Schools 
    this.schoolOtherInfoForm
      .get("noChildEnrolled")
      ?.patchValue(this.noChildEnrolled);
    this.schoolOtherInfoForm.get("noOfStCnt")?.patchValue(this.noOfStCnt);
    this.schoolOtherInfoForm
      .get("totStRTEcls1B")
      ?.patchValue(this.totStRTEcls1B);
    this.schoolOtherInfoForm
      .get("totStRTEcls1G")
      ?.patchValue(this.totStRTEcls1G);
    this.schoolOtherInfoForm
      .get("totStRTEcls1T")
      ?.patchValue(this.totStRTEcls1T);
    this.schoolOtherInfoForm
      .get("totStRTEcls1CWSNB")
      ?.patchValue(this.totStRTEcls1CWSNB);
    this.schoolOtherInfoForm
      .get("totStRTEcls1CWSNG")
      ?.patchValue(this.totStRTEcls1CWSNG);
    this.schoolOtherInfoForm
      .get("totStRTEcls1CWSNT")
      ?.patchValue(this.totStRTEcls1CWSNT);
    this.schoolOtherInfoForm
      .get("totStRTEcls2B")
      ?.patchValue(this.totStRTEcls2B);
    this.schoolOtherInfoForm
      .get("totStRTEcls2G")
      ?.patchValue(this.totStRTEcls2G);
    this.schoolOtherInfoForm
      .get("totStRTEcls2T")
      ?.patchValue(this.totStRTEcls2T);
    this.schoolOtherInfoForm
      .get("totStRTEcls3B")
      ?.patchValue(this.totStRTEcls3B);
    this.schoolOtherInfoForm
      .get("totStRTEcls3G")
      ?.patchValue(this.totStRTEcls3G);
    this.schoolOtherInfoForm
      .get("totStRTEcls3T")
      ?.patchValue(this.totStRTEcls3T);
    this.schoolOtherInfoForm
      .get("totStRTEcls4B")
      ?.patchValue(this.totStRTEcls4B);
    this.schoolOtherInfoForm
      .get("totStRTEcls4G")
      ?.patchValue(this.totStRTEcls4G);
    this.schoolOtherInfoForm
      .get("totStRTEcls4T")
      ?.patchValue(this.totStRTEcls4T);
    this.schoolOtherInfoForm
      .get("totStRTEcls5B")
      ?.patchValue(this.totStRTEcls5B);
    this.schoolOtherInfoForm
      .get("totStRTEcls5G")
      ?.patchValue(this.totStRTEcls5G);
    this.schoolOtherInfoForm
      .get("totStRTEcls5T")
      ?.patchValue(this.totStRTEcls5T);
    this.schoolOtherInfoForm
      .get("totStRTEcls6B")
      ?.patchValue(this.totStRTEcls6B);
    this.schoolOtherInfoForm
      .get("totStRTEcls6G")
      ?.patchValue(this.totStRTEcls6G);
    this.schoolOtherInfoForm
      .get("totStRTEcls6T")
      ?.patchValue(this.totStRTEcls6T);
    this.schoolOtherInfoForm
      .get("totStRTEcls7B")
      ?.patchValue(this.totStRTEcls7B);
    this.schoolOtherInfoForm
      .get("totStRTEcls7G")
      ?.patchValue(this.totStRTEcls7G);
    this.schoolOtherInfoForm
      .get("totStRTEcls7T")
      ?.patchValue(this.totStRTEcls7T);
    this.schoolOtherInfoForm
      .get("totStRTEcls8B")
      ?.patchValue(this.totStRTEcls8B);
    this.schoolOtherInfoForm
      .get("totStRTEcls8G")
      ?.patchValue(this.totStRTEcls8G);
    this.schoolOtherInfoForm
      .get("totStRTEcls8T")
      ?.patchValue(this.totStRTEcls8T);
    this.schoolOtherInfoForm
      .get("totStEWScls1B")
      ?.patchValue(this.totStEWScls1B);
    this.schoolOtherInfoForm
      .get("totStEWScls1G")
      ?.patchValue(this.totStEWScls1G);
    this.schoolOtherInfoForm
      .get("totStEWScls1T")
      ?.patchValue(this.totStEWScls1T);
    this.schoolOtherInfoForm
      .get("totStEWScls2B")
      ?.patchValue(this.totStEWScls2B);
    this.schoolOtherInfoForm
      .get("totStEWScls2G")
      ?.patchValue(this.totStEWScls2G);
    this.schoolOtherInfoForm
      .get("totStEWScls2T")
      ?.patchValue(this.totStEWScls2T);
    this.schoolOtherInfoForm
      .get("totStEWScls3B")
      ?.patchValue(this.totStEWScls3B);
    this.schoolOtherInfoForm
      .get("totStEWScls3G")
      ?.patchValue(this.totStEWScls3G);
    this.schoolOtherInfoForm
      .get("totStEWScls3T")
      ?.patchValue(this.totStEWScls3T);
    this.schoolOtherInfoForm
      .get("totStEWScls4B")
      ?.patchValue(this.totStEWScls4B);
    this.schoolOtherInfoForm
      .get("totStEWScls4G")
      ?.patchValue(this.totStEWScls4G);
    this.schoolOtherInfoForm
      .get("totStEWScls4T")
      ?.patchValue(this.totStEWScls4T);
    this.schoolOtherInfoForm
      .get("totStEWScls5B")
      ?.patchValue(this.totStEWScls5B);
    this.schoolOtherInfoForm
      .get("totStEWScls5G")
      ?.patchValue(this.totStEWScls5G);
    this.schoolOtherInfoForm
      .get("totStEWScls5T")
      ?.patchValue(this.totStEWScls5T);
    this.schoolOtherInfoForm
      .get("totStEWScls6B")
      ?.patchValue(this.totStEWScls6B);
    this.schoolOtherInfoForm
      .get("totStEWScls6G")
      ?.patchValue(this.totStEWScls6G);
    this.schoolOtherInfoForm
      .get("totStEWScls6T")
      ?.patchValue(this.totStEWScls6T);
    this.schoolOtherInfoForm
      .get("totStEWScls7B")
      ?.patchValue(this.totStEWScls7B);
    this.schoolOtherInfoForm
      .get("totStEWScls7G")
      ?.patchValue(this.totStEWScls7G);
    this.schoolOtherInfoForm
      .get("totStEWScls7G")
      ?.patchValue(this.totStEWScls7G);
    this.schoolOtherInfoForm
      .get("totStEWScls7T")
      ?.patchValue(this.totStEWScls7T);
    this.schoolOtherInfoForm
      .get("totStEWScls8B")
      ?.patchValue(this.totStEWScls8B);
    this.schoolOtherInfoForm
      .get("totStEWScls8G")
      ?.patchValue(this.totStEWScls8G);
    this.schoolOtherInfoForm
      .get("totStEWScls8T")
      ?.patchValue(this.totStEWScls8T);
    this.schoolOtherInfoForm
      .get("totStEWScls9B")
      ?.patchValue(this.totStEWScls9B);
    this.schoolOtherInfoForm
      .get("totStEWScls9G")
      ?.patchValue(this.totStEWScls9G);
    this.schoolOtherInfoForm
      .get("totStEWScls9T")
      ?.patchValue(this.totStEWScls9T);
    this.schoolOtherInfoForm
      .get("totStEWScls10B")
      ?.patchValue(this.totStEWScls10B);
    this.schoolOtherInfoForm
      .get("totStEWScls10G")
      ?.patchValue(this.totStEWScls10G);
    this.schoolOtherInfoForm
      .get("totStEWScls10T")
      ?.patchValue(this.totStEWScls10T);
    this.schoolOtherInfoForm
      .get("totStEWScls11B")
      ?.patchValue(this.totStEWScls11B);
    this.schoolOtherInfoForm
      .get("totStEWScls11G")
      ?.patchValue(this.totStEWScls11G);
    this.schoolOtherInfoForm
      .get("totStEWScls11T")
      ?.patchValue(this.totStEWScls11T);
    this.schoolOtherInfoForm
      .get("totStEWScls12B")
      ?.patchValue(this.totStEWScls12B);
    this.schoolOtherInfoForm
      .get("totStEWScls12G")
      ?.patchValue(this.totStEWScls12G);
    this.schoolOtherInfoForm
      .get("totStEWScls12T")
      ?.patchValue(this.totStEWScls12T);
    // section-7 end
    // section-8 start
    this.schoolOtherInfoForm.get("isAngloc")?.patchValue(this.isAngloc);
    this.schoolOtherInfoForm.get("angCode")?.patchValue(this.angCode);
    this.schoolOtherInfoForm.get("totChildAngB")?.patchValue(this.totChildAngB);
    this.schoolOtherInfoForm.get("totChildAngG")?.patchValue(this.totChildAngG);
    this.schoolOtherInfoForm.get("totChildAngT")?.patchValue(this.totChildAngT);
    this.schoolOtherInfoForm.get("isAngTrained")?.patchValue(this.isAngTrained);
    this.schoolOtherInfoForm.get("isAngEdu")?.patchValue(this.isAngEdu);
    this.schoolOtherInfoForm.get("isBalvatikaSt")?.patchValue(this.isBalvatikaSt);
    // section-8 end
    // section-9 start
    this.schoolOtherInfoForm
      .get("isOutChidSpTraining")
      ?.patchValue(this.isOutChidSpTraining);
    this.schoolOtherInfoForm
      .get("totSpTrErCurB")
      ?.patchValue(this.totSpTrErCurB);
    this.schoolOtherInfoForm
      .get("totSpTrErCurG")
      ?.patchValue(this.totSpTrErCurG);
    this.schoolOtherInfoForm
      .get("totSpTrErCurT")
      ?.patchValue(this.totSpTrErCurT);
    this.schoolOtherInfoForm
      .get("totSpTrErPreB")
      ?.patchValue(this.totSpTrErPreB);
    this.schoolOtherInfoForm
      .get("totSpTrErPreG")
      ?.patchValue(this.totSpTrErPreG);
    this.schoolOtherInfoForm
      .get("totSpTrErPreT")
      ?.patchValue(this.totSpTrErPreT);
    this.schoolOtherInfoForm
      .get("totSpTrComPreB")
      ?.patchValue(this.totSpTrComPreB);
    this.schoolOtherInfoForm
      .get("totSpTrComPreG")
      ?.patchValue(this.totSpTrComPreG);
    this.schoolOtherInfoForm
      .get("totSpTrComPreT")
      ?.patchValue(this.totSpTrComPreT);
    this.schoolOtherInfoForm.get("authSpTraing")?.patchValue(this.authSpTraing);
    this.schoolOtherInfoForm
      .get("plcSpTraingCond")
      ?.patchValue(this.plcSpTraingCond);
    this.schoolOtherInfoForm
      .get("typeTrainingCond")
      ?.patchValue(this.typeTrainingCond);
    this.schoolOtherInfoForm
      .get("totStAtRemedialTeacCurYr")
      ?.patchValue(this.totStAtRemedialTeacCurYr);
    this.schoolOtherInfoForm
      .get("totStLearningEnhCls")
      ?.patchValue(this.totStLearningEnhCls);
      // section-9 end
      // section-10 start
      // Details of visits to the school during the previous academic year 
    this.schoolOtherInfoForm.get("toVisitPrev")?.patchValue(this.toVisitPrev);
    this.schoolOtherInfoForm
      .get("toVisitCRCPrev")
      ?.patchValue(this.toVisitCRCPrev);
    this.schoolOtherInfoForm
      .get("toVisitBRCPrev")
      ?.patchValue(this.toVisitBRCPrev);
    this.schoolOtherInfoForm
      .get("toVisitStatePrev")
      ?.patchValue(this.toVisitStatePrev);
      // For JNV/KV/Other Central Government Schools 
    this.schoolOtherInfoForm
      .get("toVisitClusterJNV")
      ?.patchValue(this.toVisitClusterJNV);
    this.schoolOtherInfoForm
      .get("toVisiRegionJNV")
      ?.patchValue(this.toVisiRegionJNV);
    this.schoolOtherInfoForm.get("toVisiHQNV")?.patchValue(this.toVisiHQNV);

    // section-10 end
    // section-11 start
    this.schoolOtherInfoForm.get("isSMC")?.patchValue(this.isSMC);
    this.schoolOtherInfoForm.get("isSDMC")?.patchValue(this.isSDMC);
    this.schoolOtherInfoForm.get("meetSmdcCon")?.patchValue(this.meetSmdcCon);
    this.schoolOtherInfoForm.get("isSMCDevPlan")?.patchValue(this.isSMCDevPlan);
    this.schoolOtherInfoForm
      .get("SMCDevPlanYear")
      ?.patchValue(this.SMCDevPlanYear);
    this.schoolOtherInfoForm.get("isSBC")?.patchValue(this.isSBC);
    this.schoolOtherInfoForm.get("isAC")?.patchValue(this.isAC);
    this.schoolOtherInfoForm.get("isPTA")?.patchValue(this.isPTA);
    this.schoolOtherInfoForm
      .get("totPTAMeetingsCuYr")
      ?.patchValue(this.totPTAMeetingsCuYr);
    this.schoolOtherInfoForm
      .get("isScMultiClass")
      ?.patchValue(this.isScMultiClass);
    this.schoolOtherInfoForm
      .get("totClassMultiClass")
      ?.patchValue(this.totClassMultiClass);
    this.schoolOtherInfoForm
      .get("totStudentAttendMultiClass")
      ?.patchValue(this.totStudentAttendMultiClass);
    this.schoolOtherInfoForm
      .get("isSchoolComplex")
      ?.patchValue(this.isSchoolComplex);
    this.schoolOtherInfoForm
      .get("isSchoolComplexHUB")
      ?.patchValue(this.isSchoolComplexHUB);
    this.schoolOtherInfoForm
      .get("totSchoolComplextPM")
      ?.patchValue(this.totSchoolComplextPM);
    this.schoolOtherInfoForm
      .get("totSchoolComplextUP")
      ?.patchValue(this.totSchoolComplextUP);
    this.schoolOtherInfoForm
      .get("totSchoolComplextSC")
      ?.patchValue(this.totSchoolComplextSC);
    this.schoolOtherInfoForm
      .get("totSchoolComplextHS")
      ?.patchValue(this.totSchoolComplextHS);
    this.schoolOtherInfoForm
      .get("totSchoolComplext")
      ?.patchValue(this.totSchoolComplext);
      // section-11 end
      // section-12 start
    // Availability of free Textbooks, Teaching Learning Material (TLM) and play material (in current academic year)
    // Whether complete set of free textbooks received
    this.schoolOtherInfoForm
      .get("isTextBookRecievedPM")
      ?.patchValue(this.isTextBookRecievedPM);
    this.schoolOtherInfoForm
      .get("isTextBookRecievedSC")
      ?.patchValue(this.isTextBookRecievedSC);
    this.schoolOtherInfoForm
      .get("isTextBookRecievedSC")
      ?.patchValue(this.isTextBookRecievedSC);
    this.schoolOtherInfoForm
      .get("isTextBookRecievedHS")
      ?.patchValue(this.isTextBookRecievedHS);
    // Whether complete set of free textbooks received
    //  When were the textbooks received in current academic year
    this.schoolOtherInfoForm
      .get("vchStartAcademicPM")
      ?.patchValue(this.vchStartAcademicPM);
    this.schoolOtherInfoForm
      .get("vchStartAcademicUP")
      ?.patchValue(this.vchStartAcademicUP);
    this.schoolOtherInfoForm
      .get("vchStartAcademicSC")
      ?.patchValue(this.vchStartAcademicSC);
    this.schoolOtherInfoForm
      .get("vchStartAcademicHS")
      ?.patchValue(this.vchStartAcademicHS);
    //  When were the textbooks received in current academic year
    //  Whether TLM available for each grade
    this.schoolOtherInfoForm.get("isTLMAvlPM")?.patchValue(this.isTLMAvlPM);
    this.schoolOtherInfoForm.get("isTLMAvlUP")?.patchValue(this.isTLMAvlUP);
    this.schoolOtherInfoForm.get("isTLMAvlSC")?.patchValue(this.isTLMAvlSC);
    this.schoolOtherInfoForm.get("isTLMAvlHS")?.patchValue(this.isTLMAvlHS);
    //  Whether TLM available for each grade
    // If Yes, number of children provided core TLM for Language
    this.schoolOtherInfoForm.get("totTLMLPM")?.patchValue(this.totTLMLPM);
    this.schoolOtherInfoForm.get("totTLMLUP")?.patchValue(this.totTLMLUP);
    this.schoolOtherInfoForm.get("totTLMLSC")?.patchValue(this.totTLMLSC);
    this.schoolOtherInfoForm.get("totTLMLHS")?.patchValue(this.totTLMLHS);
    // If Yes, number of children provided core TLM for Language
    // If Yes, number of children provided core TLM for Mathematics
    this.schoolOtherInfoForm.get("totTLMPM")?.patchValue(this.totTLMPM);
    this.schoolOtherInfoForm.get("totTLMUP")?.patchValue(this.totTLMUP);
    this.schoolOtherInfoForm.get("totTLMSC")?.patchValue(this.totTLMSC);
    this.schoolOtherInfoForm.get("totTLMHS")?.patchValue(this.totTLMHS);
    // If Yes, number of children provided core TLM for Mathematics
    // Whether the School has received graded supplementary material in previous academic year
    this.schoolOtherInfoForm.get("gradSupMatPM")?.patchValue(this.gradSupMatPM);
    this.schoolOtherInfoForm.get("gradSupMatUP")?.patchValue(this.gradSupMatUP);
    this.schoolOtherInfoForm.get("gradSupMatSC")?.patchValue(this.gradSupMatSC);
    this.schoolOtherInfoForm.get("gradSupMatHS")?.patchValue(this.gradSupMatHS);
    // Whether the School has received graded supplementary material in previous academic year
    // If Yes, number of children provided Graded Supplementary Material
    this.schoolOtherInfoForm.get("cPGDmatPM")?.patchValue(this.cPGDmatPM);
    this.schoolOtherInfoForm.get("cPGDmatUP")?.patchValue(this.cPGDmatUP);
    this.schoolOtherInfoForm.get("cPGDmatSC")?.patchValue(this.cPGDmatSC);
    this.schoolOtherInfoForm.get("cPGDmatHS")?.patchValue(this.cPGDmatHS);
    // If Yes, number of children provided Graded Supplementary Material
    // Number of children having access to Supplementary graded material in school
    this.schoolOtherInfoForm.get("cAGDmatPM")?.patchValue(this.cAGDmatPM);
    this.schoolOtherInfoForm.get("cAGDmatUP")?.patchValue(this.cAGDmatUP);
    this.schoolOtherInfoForm.get("cAGDmatSC")?.patchValue(this.cAGDmatSC);
    this.schoolOtherInfoForm.get("cAGDmatHS")?.patchValue(this.cAGDmatHS);
    // Number of children having access to Supplementary graded material in school
    //  Number of books in the school library
    this.schoolOtherInfoForm.get("bookSchPM")?.patchValue(this.bookSchPM);
    this.schoolOtherInfoForm.get("bookSchUP")?.patchValue(this.bookSchUP);
    this.schoolOtherInfoForm.get("bookSchSC")?.patchValue(this.bookSchSC);
    this.schoolOtherInfoForm.get("bookSchHS")?.patchValue(this.bookSchHS);
    //  Number of books in the school library
    // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
    this.schoolOtherInfoForm
      .get("noBookBarowChildPM")
      ?.patchValue(this.noBookBarowChildPM);
    this.schoolOtherInfoForm
      .get("noBookBarowChildUP")
      ?.patchValue(this.noBookBarowChildUP);
    this.schoolOtherInfoForm
      .get("noBookBarowChildSC")
      ?.patchValue(this.noBookBarowChildSC);
    this.schoolOtherInfoForm
      .get("noBookBarowChildHS")
      ?.patchValue(this.noBookBarowChildHS);
    // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
    // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
    this.schoolOtherInfoForm
      .get("noPaternalCommBySchPM")
      ?.patchValue(this.noPaternalCommBySchPM);
    this.schoolOtherInfoForm
      .get("noPaternalCommBySchUP")
      ?.patchValue(this.noPaternalCommBySchUP);
    this.schoolOtherInfoForm
      .get("noPaternalCommBySchSC")
      ?.patchValue(this.noPaternalCommBySchSC);
    this.schoolOtherInfoForm
      .get("noPaternalCommBySchHS")
      ?.patchValue(this.noPaternalCommBySchHS);
    // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
    // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
    this.schoolOtherInfoForm
      .get("parentsInvSupFlnPM")
      ?.patchValue(this.parentsInvSupFlnPM);
    this.schoolOtherInfoForm
      .get("parentsInvSupFlnUP")
      ?.patchValue(this.parentsInvSupFlnUP);
    this.schoolOtherInfoForm
      .get("parentsInvSupFlnSC")
      ?.patchValue(this.parentsInvSupFlnSC);
    this.schoolOtherInfoForm
      .get("parentsInvSupFlnHS")
      ?.patchValue(this.parentsInvSupFlnHS);
    // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
    // Whether the school has introduced peer learning
    this.schoolOtherInfoForm.get("schPeerLrnPM")?.patchValue(this.schPeerLrnPM);
    this.schoolOtherInfoForm.get("schPeerLrnUP")?.patchValue(this.schPeerLrnUP);
    this.schoolOtherInfoForm.get("schPeerLrnSC")?.patchValue(this.schPeerLrnSC);
    this.schoolOtherInfoForm.get("schPeerLrnHS")?.patchValue(this.schPeerLrnHS);
    // Whether the school has introduced peer learning
    // Whether play material, games and sports equipment available for each grade
    this.schoolOtherInfoForm
      .get("isSportEquipPM")
      ?.patchValue(this.isSportEquipPM);
    this.schoolOtherInfoForm
      .get("isSportEquipUP")
      ?.patchValue(this.isSportEquipUP);
    this.schoolOtherInfoForm
      .get("isSportEquipSC")
      ?.patchValue(this.isSportEquipSC);
    this.schoolOtherInfoForm
      .get("isSportEquipHS")
      ?.patchValue(this.isSportEquipHS);
    // Whether play material, games and sports equipment available for each grade
    // section-12 end
    // section-13 start
    //key indicators
    // Number of learning outcome based assessment items created in total start
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt1")
      ?.patchValue(this.noLernOutcmAssemnt1);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt2")
      ?.patchValue(this.noLernOutcmAssemnt2);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt3")
      ?.patchValue(this.noLernOutcmAssemnt3);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt4")
      ?.patchValue(this.noLernOutcmAssemnt4);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt5")
      ?.patchValue(this.noLernOutcmAssemnt6);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt6")
      ?.patchValue(this.noLernOutcmAssemnt6);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt7")
      ?.patchValue(this.noLernOutcmAssemnt7);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt8")
      ?.patchValue(this.noLernOutcmAssemnt8);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt9")
      ?.patchValue(this.noLernOutcmAssemnt9);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt10")
      ?.patchValue(this.noLernOutcmAssemnt10);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt11")
      ?.patchValue(this.noLernOutcmAssemnt11);
    this.schoolOtherInfoForm
      .get("noLernOutcmAssemnt12")
      ?.patchValue(this.noLernOutcmAssemnt12);
    // Number of learning outcome based assessment items created in total end
    //  Number of criterionreferenced items created in Previous Academic Year start
    this.schoolOtherInfoForm
      .get("noCreatPrevYear1")
      ?.patchValue(this.noCreatPrevYear1);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear2")
      ?.patchValue(this.noCreatPrevYear2);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear3")
      ?.patchValue(this.noCreatPrevYear3);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear4")
      ?.patchValue(this.noCreatPrevYear4);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear5")
      ?.patchValue(this.noCreatPrevYear5);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear6")
      ?.patchValue(this.noCreatPrevYear6);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear7")
      ?.patchValue(this.noCreatPrevYear7);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear8")
      ?.patchValue(this.noCreatPrevYear8);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear9")
      ?.patchValue(this.noCreatPrevYear9);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear10")
      ?.patchValue(this.noCreatPrevYear10);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear11")
      ?.patchValue(this.noCreatPrevYear11);
    this.schoolOtherInfoForm
      .get("noCreatPrevYear12")
      ?.patchValue(this.noCreatPrevYear12);
    // Number of criterionreferenced items created in Previous Academic Year end
    //Whether school teachers of this school created teaching aids/tools for teaching learning start
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid1")
      ?.patchValue(this.schTchCrtTchAid1);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid2")
      ?.patchValue(this.schTchCrtTchAid2);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid3")
      ?.patchValue(this.schTchCrtTchAid3);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid4")
      ?.patchValue(this.schTchCrtTchAid4);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid5")
      ?.patchValue(this.schTchCrtTchAid5);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid6")
      ?.patchValue(this.schTchCrtTchAid6);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid7")
      ?.patchValue(this.schTchCrtTchAid7);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid8")
      ?.patchValue(this.schTchCrtTchAid8);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid9")
      ?.patchValue(this.schTchCrtTchAid9);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid10")
      ?.patchValue(this.schTchCrtTchAid10);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid11")
      ?.patchValue(this.schTchCrtTchAid11);
    this.schoolOtherInfoForm
      .get("schTchCrtTchAid12")
      ?.patchValue(this.schTchCrtTchAid12);
    // Whether school teachers of this school created teaching aids/tools for teaching learning end
    // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
    this.schoolOtherInfoForm
      .get("schActiveUndertake1")
      ?.patchValue(this.schActiveUndertake1);
    this.schoolOtherInfoForm
      .get("schActiveUndertake2")
      ?.patchValue(this.schActiveUndertake2);
    this.schoolOtherInfoForm
      .get("schActiveUndertake3")
      ?.patchValue(this.schActiveUndertake3);
    this.schoolOtherInfoForm
      .get("schActiveUndertake4")
      ?.patchValue(this.schActiveUndertake4);
    this.schoolOtherInfoForm
      .get("schActiveUndertake5")
      ?.patchValue(this.schActiveUndertake5);
    this.schoolOtherInfoForm
      .get("schActiveUndertake6")
      ?.patchValue(this.schActiveUndertake6);
    this.schoolOtherInfoForm
      .get("schActiveUndertake7")
      ?.patchValue(this.schActiveUndertake7);
    this.schoolOtherInfoForm
      .get("schActiveUndertake8")
      ?.patchValue(this.schActiveUndertake8);
    this.schoolOtherInfoForm
      .get("schActiveUndertake9")
      ?.patchValue(this.schActiveUndertake9);
    this.schoolOtherInfoForm
      .get("schActiveUndertake10")
      ?.patchValue(this.schActiveUndertake10);
    this.schoolOtherInfoForm
      .get("schActiveUndertake11")
      ?.patchValue(this.schActiveUndertake11);
    this.schoolOtherInfoForm
      .get("schActiveUndertake12")
      ?.patchValue(this.schActiveUndertake12);
    // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
    // Total Number of HardSpots identified in Learning outcomes start
    this.schoolOtherInfoForm
      .get("totalNoHardspot1")
      ?.patchValue(this.totalNoHardspot1);
    this.schoolOtherInfoForm
      .get("totalNoHardspot2")
      ?.patchValue(this.totalNoHardspot3);
    this.schoolOtherInfoForm
      .get("totalNoHardspot3")
      ?.patchValue(this.totalNoHardspot3);
    this.schoolOtherInfoForm
      .get("totalNoHardspot4")
      ?.patchValue(this.totalNoHardspot4);
    this.schoolOtherInfoForm
      .get("totalNoHardspot5")
      ?.patchValue(this.totalNoHardspot5);
    this.schoolOtherInfoForm
      .get("totalNoHardspot6")
      ?.patchValue(this.totalNoHardspot6);
    this.schoolOtherInfoForm
      .get("totalNoHardspot7")
      ?.patchValue(this.totalNoHardspot7);
    this.schoolOtherInfoForm
      .get("totalNoHardspot8")
      ?.patchValue(this.totalNoHardspot8);
    this.schoolOtherInfoForm
      .get("totalNoHardspot9")
      ?.patchValue(this.totalNoHardspot9);
    this.schoolOtherInfoForm
      .get("totalNoHardspot10")
      ?.patchValue(this.totalNoHardspot10);
    this.schoolOtherInfoForm
      .get("totalNoHardspot11")
      ?.patchValue(this.totalNoHardspot11);
    this.schoolOtherInfoForm
      .get("totalNoHardspot12")
      ?.patchValue(this.totalNoHardspot12);
    // Total Number of HardSpots identified in Learning outcomes end
    // Number of students received orientation on cyber safety start
    this.schoolOtherInfoForm
      .get("totalNoOrientation1")
      ?.patchValue(this.totalNoOrientation1);
    this.schoolOtherInfoForm
      .get("totalNoOrientation2")
      ?.patchValue(this.totalNoOrientation2);
    this.schoolOtherInfoForm
      .get("totalNoOrientation3")
      ?.patchValue(this.totalNoOrientation3);
    this.schoolOtherInfoForm
      .get("totalNoOrientation4")
      ?.patchValue(this.totalNoOrientation4);
    this.schoolOtherInfoForm
      .get("totalNoOrientation5")
      ?.patchValue(this.totalNoOrientation5);
    this.schoolOtherInfoForm
      .get("totalNoOrientation6")
      ?.patchValue(this.totalNoOrientation6);
    this.schoolOtherInfoForm
      .get("totalNoOrientation7")
      ?.patchValue(this.totalNoOrientation7);
    this.schoolOtherInfoForm
      .get("totalNoOrientation8")
      ?.patchValue(this.totalNoOrientation8);
    this.schoolOtherInfoForm
      .get("totalNoOrientation9")
      ?.patchValue(this.totalNoOrientation9);
    this.schoolOtherInfoForm
      .get("totalNoOrientation10")
      ?.patchValue(this.totalNoOrientation10);
    this.schoolOtherInfoForm
      .get("totalNoOrientation11")
      ?.patchValue(this.totalNoOrientation11);
    this.schoolOtherInfoForm
      .get("totalNoOrientation12")
      ?.patchValue(this.totalNoOrientation12);
    // Number of students received orientation on cyber safety end
    // Number of students received training on psycho-social aspects start
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco1")
      ?.patchValue(this.totalNoRecvTrnPsyco1);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco2")
      ?.patchValue(this.totalNoRecvTrnPsyco2);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco3")
      ?.patchValue(this.totalNoRecvTrnPsyco3);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco4")
      ?.patchValue(this.totalNoRecvTrnPsyco4);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco5")
      ?.patchValue(this.totalNoRecvTrnPsyco5);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco6")
      ?.patchValue(this.totalNoRecvTrnPsyco6);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco7")
      ?.patchValue(this.totalNoRecvTrnPsyco7);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco8")
      ?.patchValue(this.totalNoRecvTrnPsyco8);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco9")
      ?.patchValue(this.totalNoRecvTrnPsyco9);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco10")
      ?.patchValue(this.totalNoRecvTrnPsyco10);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco11")
      ?.patchValue(this.totalNoRecvTrnPsyco11);
    this.schoolOtherInfoForm
      .get("totalNoRecvTrnPsyco12")
      ?.patchValue(this.totalNoRecvTrnPsyco12);
    // Number of students received training on psycho-social aspects end
     // section-13 end


     console.log(this.selectedItems);
     
  }
  getSchoolOtherInfo(encId: any, academicYear: any) {
    this.spinner.show();
    this.schoolService
      .getSchoolOtherInfo(encId, academicYear)
      .subscribe((res: any) => {
        if (res.data.length > 0) {
          this.editTime = true;
          this.schoolInfo = res.data[0];
           
          this.academicYear = this.schoolInfo.academicYear;
          // section-1 start
          this.isPrePrimaryAttached = this.schoolInfo.isPrePrimaryAttached?.toString();
          this.streamAvailForArts = this.schoolInfo.streamAvailForArts;
          this.streamAvailForScience = this.schoolInfo.streamAvailForScience;
          this.streamAvailForCommerce = this.schoolInfo.streamAvailForCommerce;
          this.streamAvailForVocational =
          this.schoolInfo.streamAvailForVocational;
          this.streamAvailForOther = this.schoolInfo.streamAvailForOther;
          this.noOfSecCls1 = this.schoolInfo.noOfSecCls1;
          this.noOfSecCls2 = this.schoolInfo.noOfSecCls2;
          this.noOfSecCls3 = this.schoolInfo.noOfSecCls3;
          this.noOfSecCls4 = this.schoolInfo.noOfSecCls4;
          this.noOfSecCls5 = this.schoolInfo.noOfSecCls5;
          this.noOfSecCls6 = this.schoolInfo.noOfSecCls6;
          this.noOfSecCls7 = this.schoolInfo.noOfSecCls7;
          this.noOfSecCls8 = this.schoolInfo.noOfSecCls8;
          this.noOfSecCls9 = this.schoolInfo.noOfSecCls9;
          this.noOfSecCls10 = this.schoolInfo.noOfSecCls10;
          this.noOfSecCls11 = this.schoolInfo.noOfSecCls11;
          this.noOfSecCls12 = this.schoolInfo.noOfSecCls12;
          // section-1 end
          // section-2 start
          this.yearOfEstd = this.schoolInfo.yearOfEstd;
          this.recogYearOfP = this.schoolInfo.recogYearOfP;
          this.recogYearOfUP = this.schoolInfo.recogYearOfUP;
          this.recogYearOfS = this.schoolInfo.recogYearOfS;
          this.recogYearOfHS = this.schoolInfo.recogYearOfHS;
          this.yearOfUpgradePtoUP = this.schoolInfo.yearOfUpgradePtoUP;
          this.yearOfUpgradeUPtoS = this.schoolInfo.yearOfUpgradeUPtoS;
          this.yearOfUpgradeStoHS = this.schoolInfo.yearOfUpgradeStoHS;
          // section-2 end
          // section-3 start
          this.isSpecialschCWSN = this.schoolInfo.isSpecialschCWSN?.toString();
          this.specialSchType = this.schoolInfo.specialSchType;
          this.isShiftsch = this.schoolInfo.isShiftsch?.toString();
          this.runSkillTrainingCenter = this.schoolInfo.runSkillTrainingCenter?.toString();
          this.isResidentalsch = this.schoolInfo.isResidentalsch?.toString();
          this.residentialCategory = this.schoolInfo.residentialCategory;
          this.residentalSchType = this.schoolInfo.residentalSchType;
          this.residSchSeatsCls6Boys = this.schoolInfo.residSchSeatsCls6Boys;
          this.residSchSeatsCls6Girls = this.schoolInfo.residSchSeatsCls6Girls;
          this.residSchSeatsCls7Boys = this.schoolInfo.residSchSeatsCls7Boys;
          this.residSchSeatsCls7Girls = this.schoolInfo.residSchSeatsCls7Girls;
          this.residSchSeatsCls8Boys = this.schoolInfo.residSchSeatsCls8Boys;
          this.residSchSeatsCls8Girls = this.schoolInfo.residSchSeatsCls8Girls;
          this.residSchSeatsCls9Boys = this.schoolInfo.residSchSeatsCls9Boys;
          this.residSchSeatsCls9Girls = this.schoolInfo.residSchSeatsCls9Girls;
          this.residSchSeatsCls10Boys = this.schoolInfo.residSchSeatsCls10Boys;
          this.residSchSeatsCls10Girls =
            this.schoolInfo.residSchSeatsCls10Girls;
          this.residSchSeatsCls11Boys = this.schoolInfo.residSchSeatsCls11Boys;
          this.residSchSeatsCls11Girls =
            this.schoolInfo.residSchSeatsCls11Girls;
          this.residSchSeatsCls12Boys = this.schoolInfo.residSchSeatsCls12Boys;
          this.residSchSeatsCls12Girls =
            this.schoolInfo.residSchSeatsCls12Girls;
          this.isHostle = this.schoolInfo.isHostle?.toString();
          this.hostleType = this.schoolInfo.hostleType;
          this.boardingU = this.schoolInfo.boardingU?.toString();
          this.boardingUBoys = this.schoolInfo.boardingUBoys;
          this.boardingUGirls = this.schoolInfo.boardingUGirls;
          this.boardingUTrans = this.schoolInfo.boardingUTrans;
          this.boardingHS = this.schoolInfo.boardingHS?.toString();
          this.boardingUPBoys = this.schoolInfo.boardingUPBoys;
          this.boardingUPGirls = this.schoolInfo.boardingUPGirls;
          this.boardingUPTrans = this.schoolInfo.boardingUPTrans;
          this.boardingUP = this.schoolInfo.boardingUP?.toString();
          this.boardingSBoys = this.schoolInfo.boardingSBoys;
          this.boardingSGirls = this.schoolInfo.boardingSGirls;
          this.boardingSTrans = this.schoolInfo.boardingSTrans;
          this.boardingS = this.schoolInfo.boardingS?.toString();
          this.boardingHSBoys = this.schoolInfo.boardingHSBoys;
          this.boardingHSGirls = this.schoolInfo.boardingHSGirls;
          this.boardingHSTrans = this.schoolInfo.boardingHSTrans;
          this.isMinorityManagedSch = this.schoolInfo.isMinorityManagedSch?.toString();
          this.minorityType = this.schoolInfo.minorityType;
          // section-3 end
          //Affiliation Board of school  end
          this.afSCSec = this.schoolInfo.afSCSec;
          this.afNum = this.schoolInfo.afNum;
          this.afSCOthBoard = this.schoolInfo.afSCOthBoard;
          this.afHSSec = this.schoolInfo.afHSSec;
          this.afHSNum = this.schoolInfo.afHSNum;
          this.afHSOthBoard = this.schoolInfo.afHSOthBoard;
          //Affiliation Board of school  end
          // section-4 start
          this.isTaughtMotherTongue = this.schoolInfo.isTaughtMotherTongue?.toString();
          // this.selectedItems = [];
          // this.mediumOfInstructionsData.forEach((val: any, key: any) => {
          //   if (this.schoolInfo.mediumOfInstructions.length != 0) {
          //     if (
          //       this.schoolInfo.mediumOfInstructions.find(
          //         (x: any) => x == val.anxtValue
          //       )
          //     ) {
          //       this.selectedItems.push({
          //         anxtValue: val.anxtValue,
          //         anxtName: val.anxtName,
          //       });
          //     }
          //   }
          // });
          // this.mediumOfInstructionsOth =
          //   this.schoolInfo.mediumOfInstructionsOth;
          // this.selectedValues = [];
          // this.languagesTaughtData.forEach((val: any, key: any) => {
          //   if (this.schoolInfo.languagesTaught.length != 0) {
          //     if (
          //       this.schoolInfo.languagesTaught.find(
          //         (x: any) => x == val.anxtValue
          //       )
          //     ) {
          //       this.selectedValues.push({
          //         anxtValue: val.anxtValue,
          //         anxtName: val.anxtName,
          //       });
          //     }
          //   }
          // });
          // this.otherLanguagesTaught = this.schoolInfo.otherLanguagesTaught;
          this.languagesTaughtClas = this.schoolInfo.languagesTaughtClas;
          this.stdTLangBoys = this.schoolInfo.stdTLangBoys;
          this.stdTLangGirl = this.schoolInfo.stdTLangGirl;
          this.stdTLangTrans = this.schoolInfo.stdTLangTrans;
          this.isPreVocUP = this.schoolInfo.isPreVocUP?.toString();
          this.isProvVocEdu = this.schoolInfo.isProvVocEdu?.toString();
          // section-4 end
          // section-5 start
          // Distance of the school (in km.) from the nearest Govt./Aided school
          this.distSchPM = this.schoolInfo.distSchPM;
          this.distSchUP = this.schoolInfo.distSchUP;
          this.distSchSC = this.schoolInfo.distSchSC;
          this.distSchHS = this.schoolInfo.distSchHS;
          this.isSchApprochRoad = this.schoolInfo.isSchApprochRoad?.toString();
          // Number of instructional days (previous academic year)
          this.numInsDayPM = this.schoolInfo.numInsDayPM;
          this.numInsDayUP = this.schoolInfo.numInsDayUP;
          this.numInsDaySC = this.schoolInfo.numInsDaySC;
          this.numInsDayHS = this.schoolInfo.numInsDayHS;
          // Average school hours for children (per day) - Number of hours children stay in school
          this.avgChHrPM = this.schoolInfo.avgChHrPM;
          this.avgChHrUP = this.schoolInfo.avgChHrUP;
          this.avgChHrSC = this.schoolInfo.avgChHrSC;
          this.avgChHrHS = this.schoolInfo.avgChHrHS;
          // Average working hours for Teachers (per day) - Number of hours teachers stay in school
          this.avgTHrPM = this.schoolInfo.avgTHrPM;
          this.avgTHrUP = this.schoolInfo.avgTHrUP;
          this.avgTHrSC = this.schoolInfo.avgTHrSC;
          this.avgTHrHS = this.schoolInfo.avgTHrHS;
          // section-5 end
          // section-6 start
          this.isCCESch = this.schoolInfo.isCCESch?.toString();
          this.isCCEPM = this.schoolInfo.isCCEPM;
          this.isCCENumAssPM = this.schoolInfo.isCCENumAssPM;
          this.isCCEUP = this.schoolInfo.isCCEUP;
          this.isCCENumAssUP = this.schoolInfo.isCCENumAssUP;
          this.isCCESC = this.schoolInfo.isCCESC;
          this.isCCENumAssSC = this.schoolInfo.isCCENumAssSC;
          this.isCCEHS = this.schoolInfo.isCCEHS;
          this.isCCENumAssHS = this.schoolInfo.isCCENumAssHS;
          this.isCumMaint = this.schoolInfo.isCumMaint?.toString();
          this.isCumShared = this.schoolInfo.isCumShared?.toString();
          this.assetItemPrepBy = this.schoolInfo.assetItemPrepBy?.toString();
          this.acSesStartMonth = this.schoolInfo.acSesStartMonth;
          // section-6 start
          // section-7 start
          // Only for Private Unaided Schools 
          this.noChildEnrolled = this.schoolInfo.noChildEnrolled;
          this.noOfStCnt = this.schoolInfo.noOfStCnt;
          this.totStRTEcls1B = this.schoolInfo.totStRTEcls1B;
          this.totStRTEcls1G = this.schoolInfo.totStRTEcls1G;
          this.totStRTEcls1T = this.schoolInfo.totStRTEcls1T;
          this.totStRTEcls1CWSNB = this.schoolInfo.totStRTEcls1CWSNB;
          this.totStRTEcls1CWSNG = this.schoolInfo.totStRTEcls1CWSNG;
          this.totStRTEcls1CWSNT = this.schoolInfo.totStRTEcls1CWSNT;
          this.totStRTEcls2B = this.schoolInfo.totStRTEcls2B;
          this.totStRTEcls2G = this.schoolInfo.totStRTEcls2G;
          this.totStRTEcls2T = this.schoolInfo.totStRTEcls2T;
          this.totStRTEcls3B = this.schoolInfo.totStRTEcls3B;
          this.totStRTEcls3G = this.schoolInfo.totStRTEcls3G;
          this.totStRTEcls3T = this.schoolInfo.totStRTEcls3T;
          this.totStRTEcls4B = this.schoolInfo.totStRTEcls4B;
          this.totStRTEcls4G = this.schoolInfo.totStRTEcls4G;
          this.totStRTEcls4T = this.schoolInfo.totStRTEcls4T;
          this.totStRTEcls5B = this.schoolInfo.totStRTEcls5B;
          this.totStRTEcls5G = this.schoolInfo.totStRTEcls5G;
          this.totStRTEcls5T = this.schoolInfo.totStRTEcls5T;
          this.totStRTEcls6B = this.schoolInfo.totStRTEcls6B;
          this.totStRTEcls6G = this.schoolInfo.totStRTEcls6G;
          this.totStRTEcls6T = this.schoolInfo.totStRTEcls6T;
          this.totStRTEcls7B = this.schoolInfo.totStRTEcls7B;
          this.totStRTEcls7G = this.schoolInfo.totStRTEcls7G;
          this.totStRTEcls7T = this.schoolInfo.totStRTEcls7T;
          this.totStRTEcls8B = this.schoolInfo.totStRTEcls8B;
          this.totStRTEcls8G = this.schoolInfo.totStRTEcls8G;
          this.totStRTEcls8T = this.schoolInfo.totStRTEcls8T;

          this.totStEWScls1B = this.schoolInfo.totStEWScls1B;
          this.totStEWScls1G = this.schoolInfo.totStEWScls1G;
          this.totStEWScls1T = this.schoolInfo.totStEWScls1T;
          this.totStEWScls2B = this.schoolInfo.totStEWScls2B;
          this.totStEWScls2G = this.schoolInfo.totStEWScls2G;
          this.totStEWScls2T = this.schoolInfo.totStEWScls2T;
          this.totStEWScls3B = this.schoolInfo.totStEWScls3B;
          this.totStEWScls3G = this.schoolInfo.totStEWScls3G;
          this.totStEWScls3T = this.schoolInfo.totStEWScls3T;
          this.totStEWScls4B = this.schoolInfo.totStEWScls4B;
          this.totStEWScls4G = this.schoolInfo.totStEWScls4G;
          this.totStEWScls4T = this.schoolInfo.totStEWScls4T;
          this.totStEWScls5B = this.schoolInfo.totStEWScls5B;
          this.totStEWScls5G = this.schoolInfo.totStEWScls5G;
          this.totStEWScls5T = this.schoolInfo.totStEWScls5T;
          this.totStEWScls6B = this.schoolInfo.totStEWScls6B;
          this.totStEWScls6G = this.schoolInfo.totStEWScls6G;
          this.totStEWScls6T = this.schoolInfo.totStEWScls6T;
          this.totStEWScls7B = this.schoolInfo.totStEWScls7B;
          this.totStEWScls7G = this.schoolInfo.totStEWScls7G;
          this.totStEWScls7T = this.schoolInfo.totStEWScls7T;
          this.totStEWScls8B = this.schoolInfo.totStEWScls8B;
          this.totStEWScls8G = this.schoolInfo.totStEWScls8G;
          this.totStEWScls8T = this.schoolInfo.totStEWScls8T;
          this.totStEWScls9B = this.schoolInfo.totStEWScls9B;
          this.totStEWScls9G = this.schoolInfo.totStEWScls9G;
          this.totStEWScls9T = this.schoolInfo.totStEWScls9T;
          this.totStEWScls10B = this.schoolInfo.totStEWScls10B;
          this.totStEWScls10G = this.schoolInfo.totStEWScls10G;
          this.totStEWScls10T = this.schoolInfo.totStEWScls10T;
          this.totStEWScls11B = this.schoolInfo.totStEWScls11B;
          this.totStEWScls11G = this.schoolInfo.totStEWScls11G;
          this.totStEWScls11T = this.schoolInfo.totStEWScls11T;
          this.totStEWScls12B = this.schoolInfo.totStEWScls12B;
          this.totStEWScls12G = this.schoolInfo.totStEWScls12G;
          this.totStEWScls12T = this.schoolInfo.totStEWScls12T;
          // section-7 end
          // section-8 start
          this.isAngloc = this.schoolInfo.isAngloc?.toString();
          this.angCode = this.schoolInfo.angCode;
          this.totChildAngB = this.schoolInfo.totChildAngB;
          this.totChildAngG = this.schoolInfo.totChildAngG;
          this.totChildAngT = this.schoolInfo.totChildAngT;
          this.isAngTrained = this.schoolInfo.isAngTrained?.toString();
          this.isAngEdu = this.schoolInfo.isAngEdu?.toString();
          this.isBalvatikaSt = this.schoolInfo.isBalvatikaSt?.toString();
          // section-8 end
          // section-9 start
          this.isOutChidSpTraining = this.schoolInfo.isOutChidSpTraining?.toString();
          this.totSpTrErCurB = this.schoolInfo.totSpTrErCurB;
          this.totSpTrErCurG = this.schoolInfo.totSpTrErCurG;
          this.totSpTrErCurT = this.schoolInfo.totSpTrErCurT;
          this.totSpTrErPreB = this.schoolInfo.totSpTrErPreB;
          this.totSpTrErPreG = this.schoolInfo.totSpTrErPreG;
          this.totSpTrErPreT = this.schoolInfo.totSpTrErPreT;
          this.totSpTrComPreB = this.schoolInfo.totSpTrComPreB;
          this.totSpTrComPreG = this.schoolInfo.totSpTrComPreG;
          this.totSpTrComPreT = this.schoolInfo.totSpTrComPreT;
          this.authSpTraing = this.schoolInfo.authSpTraing;
          this.plcSpTraingCond = this.schoolInfo.plcSpTraingCond;
          this.typeTrainingCond = this.schoolInfo.typeTrainingCond;
          this.totStAtRemedialTeacCurYr =
            this.schoolInfo.totStAtRemedialTeacCurYr;
          this.totStLearningEnhCls = this.schoolInfo.totStLearningEnhCls;
          // section-9 end
          // section-10 start
          // Details of visits to the school during the previous academic year 
          this.toVisitPrev = this.schoolInfo.toVisitPrev;
          this.toVisitCRCPrev = this.schoolInfo.toVisitCRCPrev;
          this.toVisitBRCPrev = this.schoolInfo.toVisitBRCPrev;
          this.toVisitStatePrev = this.schoolInfo.toVisitStatePrev;
          this.toVisitClusterJNV = this.schoolInfo.toVisitClusterJNV;
          this.toVisiRegionJNV = this.schoolInfo.toVisiRegionJNV;
          this.toVisiHQNV = this.schoolInfo.toVisiHQNV;
          // For JNV/KV/Other Central Government Schools 
          // section-10 end
          // section-11 start
         
          this.isSMC = this.schoolInfo.isSMC?.toString();
          this.isSDMC = this.schoolInfo.isSDMC?.toString();
          this.meetSmdcCon = this.schoolInfo.meetSmdcCon;
          this.isSMCDevPlan = this.schoolInfo.isSMCDevPlan?.toString();
          this.SMCDevPlanYear = this.schoolInfo.SMCDevPlanYear;
          this.isSBC = this.schoolInfo.isSBC?.toString();
          this.isAC = this.schoolInfo.isAC?.toString();
          this.isPTA = this.schoolInfo.isPTA?.toString();
          this.totPTAMeetingsCuYr = this.schoolInfo.totPTAMeetingsCuYr;
          this.isScMultiClass = this.schoolInfo.isScMultiClass?.toString();
          this.totClassMultiClass = this.schoolInfo.totClassMultiClass;
          this.totStudentAttendMultiClass =
            this.schoolInfo.totStudentAttendMultiClass;
          this.isSchoolComplex = this.schoolInfo.isSchoolComplex?.toString();
          this.isSchoolComplexHUB = this.schoolInfo.isSchoolComplexHUB?.toString();
          this.totSchoolComplextPM = this.schoolInfo.totSchoolComplextPM;
          this.totSchoolComplextUP = this.schoolInfo.totSchoolComplextUP;
          this.totSchoolComplextSC = this.schoolInfo.totSchoolComplextSC;
          this.totSchoolComplextHS = this.schoolInfo.totSchoolComplextHS;
          this.totSchoolComplext = this.schoolInfo.totSchoolComplext;
          // section-11 end
          // section-12 start
          // Availability of free Textbooks, Teaching Learning Material (TLM) and play material (in current academic year)
          // Whether complete set of free textbooks received
          // this.isTextBookRecievedPrePM =this.schoolInfo.isTextBookRecievedPrePM;
          this.isTextBookRecievedPM = this.schoolInfo.isTextBookRecievedPM;
          this.isTextBookRecievedUP = this.schoolInfo.isTextBookRecievedUP;
          this.isTextBookRecievedSC = this.schoolInfo.isTextBookRecievedSC;
          this.isTextBookRecievedHS = this.schoolInfo.isTextBookRecievedHS;
          // Whether complete set of free textbooks received
          //  When were the textbooks received in current academic year
          this.vchStartAcademicPM = this.schoolInfo.vchStartAcademicPM;
          this.vchStartAcademicUP = this.schoolInfo.vchStartAcademicUP;
          this.vchStartAcademicSC = this.schoolInfo.vchStartAcademicSC;
          this.vchStartAcademicHS = this.schoolInfo.vchStartAcademicHS;
          //  When were the textbooks received in current academic year
          //  Whether TLM available for each grade
          this.isTLMAvlPM = this.schoolInfo.isTLMAvlPM;
          this.isTLMAvlUP = this.schoolInfo.isTLMAvlUP;
          this.isTLMAvlSC = this.schoolInfo.isTLMAvlSC;
          this.isTLMAvlHS = this.schoolInfo.isTLMAvlHS;
          //  Whether TLM available for each grade
          // If Yes, number of children provided core TLM for Language
          this.totTLMLPM = this.schoolInfo.totTLMLPM;
          this.totTLMLUP = this.schoolInfo.totTLMLUP;
          this.totTLMLSC = this.schoolInfo.totTLMLSC;
          this.totTLMLHS = this.schoolInfo.totTLMLHS;
          // If Yes, number of children provided core TLM for Language
          // If Yes, number of children provided core TLM for Mathematics
          this.totTLMPM = this.schoolInfo.totTLMPM;
          this.totTLMUP = this.schoolInfo.totTLMUP;
          this.totTLMSC = this.schoolInfo.totTLMSC;
          this.totTLMHS = this.schoolInfo.totTLMHS;
          // If Yes, number of children provided core TLM for Mathematics
          // Whether the School has received graded supplementary material in previous academic year
          this.gradSupMatPM = this.schoolInfo.gradSupMatPM;
          this.gradSupMatUP = this.schoolInfo.gradSupMatUP;
          this.gradSupMatSC = this.schoolInfo.gradSupMatSC;
          this.gradSupMatHS = this.schoolInfo.gradSupMatHS;
          // Whether the School has received graded supplementary material in previous academic year
          // If Yes, number of children provided Graded Supplementary Material
          this.cPGDmatPM = this.schoolInfo.cPGDmatPM;
          this.cPGDmatUP = this.schoolInfo.cPGDmatUP;
          this.cPGDmatSC = this.schoolInfo.cPGDmatSC;
          this.cPGDmatHS = this.schoolInfo.cPGDmatHS;
          // If Yes, number of children provided Graded Supplementary Material
          // Number of children having access to Supplementary graded material in school
          this.cAGDmatPM = this.schoolInfo.cAGDmatPM;
          this.cAGDmatUP = this.schoolInfo.cAGDmatUP;
          this.cAGDmatSC = this.schoolInfo.cAGDmatSC;
          this.cAGDmatHS = this.schoolInfo.cAGDmatHS;
          // Number of children having access to Supplementary graded material in school
          //  Number of books in the school library
          this.bookSchPM = this.schoolInfo.bookSchPM;
          this.bookSchUP = this.schoolInfo.bookSchUP;
          this.bookSchSC = this.schoolInfo.bookSchSC;
          this.bookSchHS = this.schoolInfo.bookSchHS;
          //  Number of books in the school library
          // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
          this.noBookBarowChildPM = this.schoolInfo.noBookBarowChildPM;
          this.noBookBarowChildUP = this.schoolInfo.noBookBarowChildUP;
          this.noBookBarowChildSC = this.schoolInfo.noBookBarowChildSC;
          this.noBookBarowChildHS = this.schoolInfo.noBookBarowChildHS;
          // Number of times Library books have been borrowed/ read by children of that class (given total of issue register)
          // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
          this.noPaternalCommBySchPM = this.schoolInfo.noPaternalCommBySchPM;
          this.noPaternalCommBySchUP = this.schoolInfo.noPaternalCommBySchUP;
          this.noPaternalCommBySchSC = this.schoolInfo.noPaternalCommBySchSC;
          this.noPaternalCommBySchHS = this.schoolInfo.noPaternalCommBySchHS;
          // Number of parental communications by the school (through teachers of that grade) of regarding learning outcomes to be achieved by their child in the given year
          // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
          this.parentsInvSupFlnPM = this.schoolInfo.parentsInvSupFlnPM;
          this.parentsInvSupFlnUP = this.schoolInfo.parentsInvSupFlnUP;
          this.parentsInvSupFlnSC = this.schoolInfo.parentsInvSupFlnSC;
          this.parentsInvSupFlnHS = this.schoolInfo.parentsInvSupFlnHS;
          // Whether parents/ volunteers are actively involved in supporting the school to achieve FLN
          // Whether the school has introduced peer learning
          this.schPeerLrnPM = this.schoolInfo.schPeerLrnPM;
          this.schPeerLrnUP = this.schoolInfo.schPeerLrnUP;
          this.schPeerLrnSC = this.schoolInfo.schPeerLrnSC;
          this.schPeerLrnHS = this.schoolInfo.schPeerLrnHS;
          // Whether the school has introduced peer learning
          // Whether play material, games and sports equipment available for each grade
          this.isSportEquipPM = this.schoolInfo.isSportEquipPM;
          this.isSportEquipUP = this.schoolInfo.isSportEquipUP;
          this.isSportEquipSC = this.schoolInfo.isSportEquipSC;
          this.isSportEquipHS = this.schoolInfo.isSportEquipHS;
          // Whether play material, games and sports equipment available for each grade
           // section-12 end
           // section-13 start
          // key indicators
          // Number of learning outcome based assessment items created in total start
          this.noLernOutcmAssemnt1 = this.schoolInfo.noLernOutcmAssemnt1;
          this.noLernOutcmAssemnt2 = this.schoolInfo.noLernOutcmAssemnt2;
          this.noLernOutcmAssemnt3 = this.schoolInfo.noLernOutcmAssemnt3;
          this.noLernOutcmAssemnt4 = this.schoolInfo.noLernOutcmAssemnt4;
          this.noLernOutcmAssemnt5 = this.schoolInfo.noLernOutcmAssemnt5;
          this.noLernOutcmAssemnt6 = this.schoolInfo.noLernOutcmAssemnt6;
          this.noLernOutcmAssemnt7 = this.schoolInfo.noLernOutcmAssemnt7;
          this.noLernOutcmAssemnt8 = this.schoolInfo.noLernOutcmAssemnt8;
          this.noLernOutcmAssemnt9 = this.schoolInfo.noLernOutcmAssemnt9;
          this.noLernOutcmAssemnt10 = this.schoolInfo.noLernOutcmAssemnt10;
          this.noLernOutcmAssemnt11 = this.schoolInfo.noLernOutcmAssemnt11;
          this.noLernOutcmAssemnt12 = this.schoolInfo.noLernOutcmAssemnt12;
          // Number of learning outcome based assessment items created in total end
          //  Number of criterionreferenced items created in Previous Academic Year start
          this.noCreatPrevYear1 = this.schoolInfo.noCreatPrevYear1;
          this.noCreatPrevYear2 = this.schoolInfo.noCreatPrevYear2;
          this.noCreatPrevYear3 = this.schoolInfo.noCreatPrevYear3;
          this.noCreatPrevYear4 = this.schoolInfo.noCreatPrevYear4;
          this.noCreatPrevYear5 = this.schoolInfo.noCreatPrevYear5;
          this.noCreatPrevYear6 = this.schoolInfo.noCreatPrevYear6;
          this.noCreatPrevYear7 = this.schoolInfo.noCreatPrevYear7;
          this.noCreatPrevYear8 = this.schoolInfo.noCreatPrevYear8;
          this.noCreatPrevYear9 = this.schoolInfo.noCreatPrevYear9;
          this.noCreatPrevYear10 = this.schoolInfo.noCreatPrevYear10;
          this.noCreatPrevYear11 = this.schoolInfo.noCreatPrevYear11;
          this.noCreatPrevYear12 = this.schoolInfo.noCreatPrevYear12;
          // Number of criterionreferenced items created in Previous Academic Year end
          // Whether school teachers of this school created teaching aids/tools for teaching learning start
          this.schTchCrtTchAid1 = this.schoolInfo.schTchCrtTchAid1;
          this.schTchCrtTchAid2 = this.schoolInfo.schTchCrtTchAid2;
          this.schTchCrtTchAid3 = this.schoolInfo.schTchCrtTchAid3;
          this.schTchCrtTchAid4 = this.schoolInfo.schTchCrtTchAid4;
          this.schTchCrtTchAid5 = this.schoolInfo.schTchCrtTchAid5;
          this.schTchCrtTchAid6 = this.schoolInfo.schTchCrtTchAid6;
          this.schTchCrtTchAid7 = this.schoolInfo.schTchCrtTchAid7;
          this.schTchCrtTchAid8 = this.schoolInfo.schTchCrtTchAid8;
          this.schTchCrtTchAid9 = this.schoolInfo.schTchCrtTchAid9;
          this.schTchCrtTchAid10 = this.schoolInfo.schTchCrtTchAid10;
          this.schTchCrtTchAid11 = this.schoolInfo.schTchCrtTchAid11;
          this.schTchCrtTchAid12 = this.schoolInfo.schTchCrtTchAid12;
          // Whether school teachers of this school created teaching aids/tools for teaching learning end
          // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc start
          this.schActiveUndertake1 = this.schoolInfo.schActiveUndertake1;
          this.schActiveUndertake2 = this.schoolInfo.schActiveUndertake2;
          this.schActiveUndertake3 = this.schoolInfo.schActiveUndertake3;
          this.schActiveUndertake4 = this.schoolInfo.schActiveUndertake4;
          this.schActiveUndertake5 = this.schoolInfo.schActiveUndertake5;
          this.schActiveUndertake6 = this.schoolInfo.schActiveUndertake6;
          this.schActiveUndertake7 = this.schoolInfo.schActiveUndertake7;
          this.schActiveUndertake8 = this.schoolInfo.schActiveUndertake8;
          this.schActiveUndertake9 = this.schoolInfo.schActiveUndertake9;
          this.schActiveUndertake10 = this.schoolInfo.schActiveUndertake10;
          this.schActiveUndertake11 = this.schoolInfo.schActiveUndertake11;
          this.schActiveUndertake12 = this.schoolInfo.schActiveUndertake12;
          // Whether the school actively undertakes academic enrichment activities, such as Project/Group work, portfolio, virtual labs, class performances, quizzes/debates, creative writing, etc end
          //  Total Number of HardSpots identified in Learning outcomes start
          this.totalNoHardspot1 = this.schoolInfo.totalNoHardspot1;
          this.totalNoHardspot2 = this.schoolInfo.totalNoHardspot2;
          this.totalNoHardspot3 = this.schoolInfo.totalNoHardspot3;
          this.totalNoHardspot4 = this.schoolInfo.totalNoHardspot4;
          this.totalNoHardspot5 = this.schoolInfo.totalNoHardspot5;
          this.totalNoHardspot6 = this.schoolInfo.totalNoHardspot6;
          this.totalNoHardspot7 = this.schoolInfo.totalNoHardspot7;
          this.totalNoHardspot8 = this.schoolInfo.totalNoHardspot8;
          this.totalNoHardspot9 = this.schoolInfo.totalNoHardspot9;
          this.totalNoHardspot10 = this.schoolInfo.totalNoHardspot10;
          this.totalNoHardspot11 = this.schoolInfo.totalNoHardspot11;
          this.totalNoHardspot12 = this.schoolInfo.totalNoHardspot12;
          // Total Number of HardSpots identified in Learning outcomes end
          // Number of students received orientation on cyber safety start
          this.totalNoOrientation1 = this.schoolInfo.totalNoOrientation1;
          this.totalNoOrientation2 = this.schoolInfo.totalNoOrientation2;
          this.totalNoOrientation3 = this.schoolInfo.totalNoOrientation3;
          this.totalNoOrientation4 = this.schoolInfo.totalNoOrientation4;
          this.totalNoOrientation5 = this.schoolInfo.totalNoOrientation5;
          this.totalNoOrientation6 = this.schoolInfo.totalNoOrientation6;
          this.totalNoOrientation7 = this.schoolInfo.totalNoOrientation7;
          this.totalNoOrientation8 = this.schoolInfo.totalNoOrientation8;
          this.totalNoOrientation9 = this.schoolInfo.totalNoOrientation9;
          this.totalNoOrientation10 = this.schoolInfo.totalNoOrientation10;
          this.totalNoOrientation11 = this.schoolInfo.totalNoOrientation11;
          this.totalNoOrientation12 = this.schoolInfo.totalNoOrientation12;
          // Number of students received orientation on cyber safety end
          // Number of students received training on psycho-social aspects start
          this.totalNoRecvTrnPsyco1 = this.schoolInfo.totalNoRecvTrnPsyco1;
          this.totalNoRecvTrnPsyco2 = this.schoolInfo.totalNoRecvTrnPsyco2;
          this.totalNoRecvTrnPsyco3 = this.schoolInfo.totalNoRecvTrnPsyco3;
          this.totalNoRecvTrnPsyco4 = this.schoolInfo.totalNoRecvTrnPsyco4;
          this.totalNoRecvTrnPsyco5 = this.schoolInfo.totalNoRecvTrnPsyco5;
          this.totalNoRecvTrnPsyco6 = this.schoolInfo.totalNoRecvTrnPsyco6;
          this.totalNoRecvTrnPsyco7 = this.schoolInfo.totalNoRecvTrnPsyco7;
          this.totalNoRecvTrnPsyco8 = this.schoolInfo.totalNoRecvTrnPsyco8;
          this.totalNoRecvTrnPsyco9 = this.schoolInfo.totalNoRecvTrnPsyco9;
          this.totalNoRecvTrnPsyco10 = this.schoolInfo.totalNoRecvTrnPsyco10;
          this.totalNoRecvTrnPsyco11 = this.schoolInfo.totalNoRecvTrnPsyco11;
          this.totalNoRecvTrnPsyco12 = this.schoolInfo.totalNoRecvTrnPsyco12;
          // Number of students received training on psycho-social aspects end
          // section-13 end
          this.draftStatus = this.schoolInfo.draftStatus;
          // this.resetForm();
          this.initializeForm();
        } else {
          this.editTime = false;
          this.initializeForm();
        }
        this.spinner.hide();
      });
  }
  //annexture value call start
  loadAnnexturesDataBySeq(){
    const anxTypes = [
      "SPECIAL_SCHOOL_TYPE",
      "RESIDENTIAL_CATEGORY",
      "RESIDENTIAL_SCHOOL_TYPE",
      // "LANGUAGE",
      "HOSTLE_TYPE",
      "MINORITY_COMMUNITY_TYPE",
      "BOARD_OF_SCHHOL",
      // "MEDIUM_OF_INSTRUCTION",
    ];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        this.specialSchoolTypeData = res?.data?.SPECIAL_SCHOOL_TYPE;
        this.residentialCategoryData = res?.data?.RESIDENTIAL_CATEGORY;
        this.residentialSchoolTypeData = res?.data?.RESIDENTIAL_SCHOOL_TYPE;
        // this.languagesTaughtData = res?.data?.LANGUAGE;
        this.hostleTypeData = res?.data?.HOSTLE_TYPE;
        this.minorityCommunityData = res?.data?.MINORITY_COMMUNITY_TYPE;
        this.secondarySectionsData = res?.data?.BOARD_OF_SCHHOL;
        // this.mediumOfInstructionsData = res?.data?.MEDIUM_OF_INSTRUCTION;  
        this.getSchoolOtherInfo(this.encId, this.academicYear);
      },
    });
  }

  //annexture value call end
  getMaxAndMinClassAndMgmt(encId: any, academicYear: any) {
    this.schoolService
      .getMaxAndMinClassAndMgmt(encId, academicYear)
      .subscribe((res: any) => {
        this.highestClass = res.data?.maxClass;
        this.lowestClass = res.data?.minClass;
        this.schoolType = res.data?.management;
        if (this.schoolType == 1 || this.schoolType == 2 || this.schoolType == 4 || this.schoolType == 10 || this.schoolType == 12 || this.schoolType == 13 || this.schoolType == 15 || this.schoolType == 16 || this.schoolType == 90 || this.schoolType == 97) {
          this.govtSchool = true;
        }
        if (this.schoolType == 5) {
          this.privateSchool = true;
        }
        if (this.schoolType == 93) {
          this.jnkvSchool = true;
        }
      });
  }
  // meduimValueCheck(e: any) {
  //   this.mediumOfInstructions.push(e);
  //   if (e.anxtValue == 99) {
  //     this.other_Medium = true;
  //   }
  // }
  // deSelectMeduimValueCheck(e: any) {
  //   this.mediumOfInstructions.forEach((value: any, index: any) => {
  //     if (value.anxtValue == e.anxtValue)
  //       this.mediumOfInstructions.splice(index, 1);
  //   });
  //   if (e.anxtValue == 99) {
  //     this.other_Medium = false;
  //   }
  // }
  // languagesTaughtCheck(e: any) {
  //   this.languagesTaught.push(e);
  //   if (e.anxtValue == 99) {
  //     this.other_Language = true;
  //   }
  // }
  // languagesTaughtDeCheck(e: any) {
  //   this.languagesTaught.forEach((value: any, index: any) => {
  //     if (value.anxtValue == e.anxtValue)
  //       this.mediumOfInstructions.splice(index, 1);
  //   });
  //   if (e.anxtValue == 99) {
  //     this.other_Language = false;
  //   }
  // }

  isSpecialschCWSNSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      specialSchType: "",
    });
    this.isSpecialschCWSN = val;
  }
  residentalRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      residentialCategory: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residentalSchType: "",
    });
    this.isResidentalsch = val;
  }
  residentialCatSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      residentalSchType: "",
    });
    this.schoolOtherInfoForm.patchValue({
      isHostle: "2",
    });
    this.residentialCategory = val;
  }
  residentialSchoolTypeSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls6Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls7Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls8Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls9Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls10Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls11Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls12Boys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls6Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls7Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls8Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls9Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls10Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls11Girls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      residSchSeatsCls12Girls: "",
    });
    this.residentalSchType = val;
  }
  hostleRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      hostleType: "",
    });
    this.isHostle = val;
  }
  boardingURadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      boardingUBoys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingUGirls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingUTrans: "",
    });
    this.boardingU = val;
  }
  boardingUPRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      boardingUPBoys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingUPGirls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingUPTrans: "",
    });
    this.boardingUP = val;
  }
  boardingSRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      boardingSBoys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingSGirls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingSTrans: "",
    });
    this.boardingS = val;
  }
  boardingHSRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      boardingHSBoys: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingHSGirls: "",
    });
    this.schoolOtherInfoForm.patchValue({
      boardingHSTrans: "",
    });
    this.boardingHS = val;
  }
  minorityManagedSchRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      minorityType: "",
    });
    this.isMinorityManagedSch = val;
  }
  secondarySectionsSelControl(val: any) {
    this.afSCSec = val;
  }
  higerSecondarySectionsSelControl(val: any) {
    this.afHSSec = val;
  }
  anglocRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      angCode: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totChildAngB: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totChildAngG: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totChildAngT: "",
    });
    this.schoolOtherInfoForm.patchValue({
      isAngTrained: "2",
    });
    this.schoolOtherInfoForm.patchValue({
      isAngEdu: "2",
    });
    this.isAngloc = val;
  }
  outChidSpTrainingRadioControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totSpTrErCurB: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrErCurG: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrErCurT: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrErPreB: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrErPreG: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrErPreT: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrComPreB: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrComPreG: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSpTrComPreT: "",
    });
    this.schoolOtherInfoForm.patchValue({
      authSpTraing: "",
    });
    this.schoolOtherInfoForm.patchValue({
      plcSpTraingCond: "",
    });
    this.schoolOtherInfoForm.patchValue({
      typeTrainingCond: "",
    });
    this.isOutChidSpTraining = val;
  }
  TLMAvlPMSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totTLMLPM: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totTLMPM: "",
    });
    this.isTLMAvlPM = val;
  }
  TLMAvlUPSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totTLMLUP: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totTLMUP: "",
    });
    this.isTLMAvlUP = val;
  }
  TLMAvlSCSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totTLMLSC: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totTLMSC: "",
    });
    this.isTLMAvlSC = val;
  }
  TLMAvlHSSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totTLMLHS: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totTLMHS: "",
    });
    this.isTLMAvlHS = val;
  }

  gradSupMatPMSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      cPGDmatPM: "",
    });
    this.gradSupMatPM = val;
  }
  gradSupMatUPSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      cPGDmatUP: "",
    });
    this.gradSupMatUP = val;
  }
  gradSupMatSCSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      cPGDmatSC: "",
    });
    this.gradSupMatSC = val;
  }
  gradSupMatHSSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      cPGDmatHS: "",
    });
    this.gradSupMatHS = val;
  }

  SMCDevPlanSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      SMCDevPlanYear: "",
    });
    this.isSMCDevPlan = val;
  }
  PTASelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totPTAMeetingsCuYr: "",
    });
    this.isPTA = val;
  }
  
  schMultiClsSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totClassMultiClass: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totStudentAttendMultiClass: "",
    });
    this.isScMultiClass = val;
  }
  schComplexHUBSelControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      totSchoolComplextPM: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSchoolComplextUP: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSchoolComplextSC: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSchoolComplextHS: "",
    });
    this.schoolOtherInfoForm.patchValue({
      totSchoolComplext: "",
    });
    this.isSchoolComplexHUB = val;
  }
  smdcRadioControl(val: any) {
    this.isSDMC = val;
  }
  smcRadioControl(val: any) {
    this.isSMC = val;
  }
  isCCEPMControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      isCCENumAssPM: "",
    });
    this.isCCEPM = val;
  }
  isCCEUPControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      isCCENumAssUP: "",
    });
    this.isCCEUP = val;
  }
  isCCESCControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      isCCENumAssSC: "",
    });
    this.isCCESC = val;
  }
  isCCEHSControl(val: any) {
    this.schoolOtherInfoForm.patchValue({
      isCCENumAssHS: "",
    });
    this.isCCEHS = val;
  }
  onSubmit() {
    // if ("INVALID" === this.schoolOtherInfoForm.status) {
    //   for (const key of Object.keys(this.schoolOtherInfoForm.controls)) {
    //     if (this.schoolOtherInfoForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.customFormValidationHandler(this.schoolOtherInfoForm);
    //       break;
    //     }
    //   }
    // }
    // if (this.schoolOtherInfoForm.invalid) {
    //   return;
    // }
    this.submitted = true;
    if (this.schoolOtherInfoForm.invalid) {
      this.customValidators.formValidationHandler(
        this.schoolOtherInfoForm,
        this.allLabel,
        this.el
      );
    }
    if (this.schoolOtherInfoForm.get("isResidentalsch")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["residentialCategory"]?.value =="" || this.schoolOtherInfoForm.controls["residentialCategory"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="residentialCategory"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Residential category is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("residentialCategory")?.value == 1 || this.schoolOtherInfoForm.get("residentialCategory")?.value == 2) {
      if (this.schoolOtherInfoForm.controls["residentalSchType"]?.value =="" || this.schoolOtherInfoForm.controls["residentalSchType"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="residentalSchType"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Type of residential school is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isMinorityManagedSch")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["minorityType"]?.value =="" || this.schoolOtherInfoForm.controls["minorityType"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="minorityType"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Type of minority community managing the school is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isCCEPM")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["isCCENumAssPM"]?.value =="" || this.schoolOtherInfoForm.controls["isCCENumAssPM"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isCCENumAssPM"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of Assessments made during the year for primary is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isCCEUP")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["isCCENumAssUP"]?.value =="" || this.schoolOtherInfoForm.controls["isCCENumAssUP"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isCCENumAssUP"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of Assessments made during the year for upper primary is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isCCESC")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["isCCENumAssSC"]?.value =="" || this.schoolOtherInfoForm.controls["isCCENumAssSC"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isCCENumAssSC"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of Assessments made during the year for secondary is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isCCEHS")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["isCCENumAssHS"]?.value =="" || this.schoolOtherInfoForm.controls["isCCENumAssHS"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="isCCENumAssHS"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of Assessments made during the year for higher secondary is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isAngloc")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["angCode"]?.value =="" || this.schoolOtherInfoForm.controls["angCode"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="angCode"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Code of the Anganwadi Centre is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isAngloc")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totChildAngB"]?.value =="" || this.schoolOtherInfoForm.controls["totChildAngB"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totChildAngB"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total boys children in Anganwadi Centre is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isAngloc")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totChildAngG"]?.value =="" || this.schoolOtherInfoForm.controls["totChildAngG"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totChildAngG"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total girls children in Anganwadi Centre is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isAngloc")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totChildAngT"]?.value =="" || this.schoolOtherInfoForm.controls["totChildAngT"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totChildAngT"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total transgender children in Anganwadi Centre is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErCurB"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErCurB"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErCurB"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of boys children enrolled for special training in current year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErCurG"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErCurG"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErCurG"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of girls children enrolled for special training in current year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErCurT"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErCurT"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErCurT"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of transgender children enrolled for special training in current year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErPreB"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErPreB"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErPreB"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of boys children enrolled for Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErPreG"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErPreG"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErPreG"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of girls children enrolled for Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrErPreT"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrErPreT"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrErPreT"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of transgender children enrolled for Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrComPreB"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrComPreB"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrComPreB"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of boys children completed Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrComPreG"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrComPreG"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrComPreG"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of girls children completed Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSpTrComPreT"]?.value =="" || this.schoolOtherInfoForm.controls["totSpTrComPreT"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSpTrComPreT"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","No. of transgender children completed Special Training in previous academic year is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["authSpTraing"]?.value =="" || this.schoolOtherInfoForm.controls["authSpTraing"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="authSpTraing"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Who conducts Special Training is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["plcSpTraingCond"]?.value =="" || this.schoolOtherInfoForm.controls["plcSpTraingCond"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="plcSpTraingCond"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Where is Special Training conducted is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isOutChidSpTraining")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["typeTrainingCond"]?.value =="" || this.schoolOtherInfoForm.controls["typeTrainingCond"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="typeTrainingCond"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Type of Training being conducted is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isSchoolComplexHUB")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSchoolComplextPM"]?.value =="" || this.schoolOtherInfoForm.controls["totSchoolComplextPM"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSchoolComplextPM"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of primary schools in the school complex is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isSchoolComplexHUB")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSchoolComplextUP"]?.value =="" || this.schoolOtherInfoForm.controls["totSchoolComplextUP"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSchoolComplextUP"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of upper primary schools in the school complex is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isSchoolComplexHUB")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSchoolComplextSC"]?.value =="" || this.schoolOtherInfoForm.controls["totSchoolComplextSC"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSchoolComplextSC"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of secondary schools in the school complex is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isSchoolComplexHUB")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSchoolComplextHS"]?.value =="" || this.schoolOtherInfoForm.controls["totSchoolComplextHS"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSchoolComplextHS"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Number of higher secondary schools in the school complex is required");
        return;
      }
    }
    if (this.schoolOtherInfoForm.get("isSchoolComplexHUB")?.value == 1) {
      if (this.schoolOtherInfoForm.controls["totSchoolComplext"]?.value =="" || this.schoolOtherInfoForm.controls["totSchoolComplext"]?.value == null) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSchoolComplext"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Total number of schools in the school complex is required");
        return;
      }
    }
 

    if (this.schoolOtherInfoForm.valid === true) {
      if(this.draftStatus==1){
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
              this.schoolService
              .schoolOtherInfoUpdate(this.schoolOtherInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "School other info data saved successfully.",
                      "success"
                    )
                    .then(() => {
                      // this.route.navigate(
                      //   ["./../../physicalInfo/" + this.encId],
                      //   {
                      //     relativeTo: this.router,
                      //   }
                      // );
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
      }else{
        this.alertHelper.updateAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
              this.schoolService
              .schoolOtherInfoUpdate(this.schoolOtherInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "School other info data updated successfully.",
                      "success"
                    )
                    .then(() => {
                      // this.route.navigate(
                      //   ["./../../physicalInfo/" + this.encId],
                      //   {
                      //     relativeTo: this.router,
                      //   }
                      // );
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
  }
  pageChangeWarningHandler(path: string) {
    let isFormFilled: boolean = false;
    const otherInfoObj = this.schoolOtherInfoForm?.value; 
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
  checkYearValidation(event: any, controlName: any) {
    if (event.value !== "" && parseInt(event.value) > this.currentYear) {
      this.alertHelper
        .viewAlert(
          "error",
          "Invalid",
          controlName + " can not be grater than " + this.currentYear
        )
        .then((res: any) => {
          event.focus();
        });
    }
  }
   yearValidation(primaryCntrl: any, compairCntrl: any,primaryLabel:any,compairLabel:any) {
    
    if (primaryCntrl.value != "" && parseInt(primaryCntrl.value) > this.currentYear) {
      this.alertHelper.viewAlert("error","Invalid",primaryLabel + " can not be grater than " + this.currentYear)
        .then((res: any) => {
          primaryCntrl.focus();
        });
    }
    else if (primaryCntrl.value != "" && compairCntrl.value =="") {
      this.alertHelper.viewAlert("error","Invalid",compairLabel + " can not be blank ")
        .then((res: any) => {
          primaryCntrl.focus();
      });
    }else if (primaryCntrl.value != "" && compairCntrl.value !="" && (parseInt(primaryCntrl.value) < parseInt(compairCntrl.value))) {
      this.alertHelper.viewAlert("error","Invalid",primaryLabel + " can not be grater than " + compairLabel)
        .then((res: any) => {
          primaryCntrl.focus();
      });
    }
  }
}
