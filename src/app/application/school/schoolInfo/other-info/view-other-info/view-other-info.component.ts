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

@Component({
  selector: 'app-view-other-info',
  templateUrl: './view-other-info.component.html',
  styleUrls: ['./view-other-info.component.css']
})
export class ViewOtherInfoComponent implements OnInit {
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
  specialSchTypeName:any="";
  isShiftsch: any               = "2";
  runSkillTrainingCenter: any   = "2";
  isResidentalsch: any          = "2";
  residentialCategory: any      = "";
  residentialCategoryName:any="";
  residentalSchType: any        = "";
  residentalSchTypeName:any="";
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
  hostleTypeName: any = "";
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
  minorityTypeName: any = "";
  //section-3 end
  //Affiliation Board of school  start
  afSCSec: any = "";
  afSCSecName: any = "";
  afNum: any = "";
  afSCOthBoard: any = "";
  afHSSec: any = "";
  afHSSecName: any = "";
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
    private commonService: CommonserviceService
  ) {}

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonService.getUserProfile();
    this.userId = this.userProfile?.userId;
      this.getMaxAndMinClassAndMgmt(this.encId, this.academicYear);
  }

  getSchoolOtherInfo(encId: any, academicYear: any) {
    this.spinner.show();
    this.schoolService
      .getSchoolOtherInfo(encId, academicYear)
      .subscribe((res: any) => {
        if (res.data.length > 0) {
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
          if(this.specialSchType!=""||this.specialSchType!=0){
            this.specialSchTypeName=this.specialSchoolTypeData.filter((item:any) => item.anxtValue === this.specialSchType)[0]['anxtName'];
          }

          this.isShiftsch = this.schoolInfo.isShiftsch?.toString();
          this.runSkillTrainingCenter = this.schoolInfo.runSkillTrainingCenter?.toString();
          this.isResidentalsch = this.schoolInfo.isResidentalsch?.toString();
          this.residentialCategory = this.schoolInfo.residentialCategory;
          if(this.residentialCategory!=""||this.residentialCategory!=0){
            this.residentialCategoryName= this.residentialCategoryData.filter((item:any) => item.anxtValue === this.residentialCategory)[0]['anxtName'];
          }

          this.residentalSchType = this.schoolInfo.residentalSchType;
          if(this.residentalSchType!=""||this.residentalSchType!=0){
            this.residentalSchTypeName = this.residentialSchoolTypeData.filter((item:any) => item.anxtValue === this.residentalSchType)[0]['anxtName'];
          }
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
          if(this.hostleType!=""||this.hostleType!=0){
            this.hostleTypeName = this.hostleTypeData.filter((item:any) => item.anxtValue === this.hostleType)[0]['anxtName'];
          }
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
          if(this.minorityType!=""||this.minorityType!=0){
            this.minorityTypeName = this.minorityCommunityData.filter((item:any) => item.anxtValue === this.minorityType)[0]['anxtName'];
          }
          // section-3 end
          //Affiliation Board of school  end
          this.afSCSec = this.schoolInfo.afSCSec;
          if(this.afSCSec!=""||this.afSCSec!=0){
            this.afSCSecName = this.secondarySectionsData.filter((item:any) => item.anxtValue === this.afSCSec)[0]['anxtName'];
          }
          this.afNum = this.schoolInfo.afNum;
          this.afSCOthBoard = this.schoolInfo.afSCOthBoard;
          this.afHSSec = this.schoolInfo.afHSSec;
          if(this.afHSSec!=""||this.afHSSec!=0){
            this.afHSSecName = this.secondarySectionsData.filter((item:any) => item.anxtValue === this.afHSSec)[0]['anxtName'];
          }
          this.afHSNum = this.schoolInfo.afHSNum;
          this.afHSOthBoard = this.schoolInfo.afHSOthBoard;
          //Affiliation Board of school  end
          // section-4 start
          this.isTaughtMotherTongue = this.schoolInfo.isTaughtMotherTongue?.toString();
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
          // this.initializeForm();
        } else {
          this.editTime = false;
          // this.initializeForm();
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
        this.loadAnnexturesDataBySeq();
      });
  }
}
