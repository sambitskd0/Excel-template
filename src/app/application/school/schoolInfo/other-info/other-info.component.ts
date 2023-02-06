import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { SchoolService } from "../../services/school.service";
import { Constant } from "src/app/shared/constants/constant";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

@Component({
  selector: "app-other-info",
  templateUrl: "./other-info.component.html",
  styleUrls: ["./other-info.component.css"],
})
export class OtherInfoComponent implements OnInit {
  enableEdit : boolean = false;
  dataLength : boolean = false;
  verificationStatus: any = "";
  crStatus: any = "";
  freezStatus: any = "";
  activationFlag: any = "";
  schoolOtherInfoForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
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
    private commonService: CommonserviceService
  ) {}

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.getSchoolStatusForEditOrViewInfo(this.encId, this.academicYear);
  }
  getSchoolStatusForEditOrViewInfo(encId: any, academicYear: any){
    this.schoolService
    .getSchoolStatusForEditOrViewInfo(encId, academicYear)
    .subscribe((res: any) => {
      this.verificationStatus = res.data?.verificationStatus;
      this.crStatus = res.data?.crStatus;
      this.freezStatus = res.data?.freezStatus;
      this.activationFlag = res.data?.activationFlag;
      if(this.verificationStatus== 0 && (this.crStatus==0 || this.crStatus==2) && this.freezStatus==0 && this.userProfile.loginUserTypeId==2 && this.activationFlag ==0){
        this.enableEdit = true;
      }else if(this.verificationStatus==3 && this.userProfile.loginUserTypeId==2 && this.crStatus==2 && this.activationFlag ==0){
        this.enableEdit = true;
      } 
      this.dataLength=true;
    });
    
  }

}
