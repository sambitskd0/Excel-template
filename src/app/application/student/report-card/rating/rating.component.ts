import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  @Input() rating: any;
  @Input() itemId: any;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  inputName: any;
  ngOnInit() {
    this.inputName = this.itemId + '_rating';
  }

  ngOnChanges(changes: SimpleChanges): void {  
    this.inputName = this.itemId + '_rating';
  }

  onClick(rating: number): void {
    console.log(rating);
    
    this.rating = rating;
    this.ratingClick.emit({
      itemId: this.itemId,
      rating: rating
    });
  }

}
