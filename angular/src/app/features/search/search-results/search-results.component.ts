import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JourneyResult } from '../../../models.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: false
})
export class SearchResultsComponent {
  @Input() journeys: JourneyResult[] = [];
  @Input() kedvId: number = 3;
  @Output() info = new EventEmitter<any>();
  @Input() date: string = ""; 

  showInfo = false;

  onInfo(journey: any) {
    this.info.emit(journey);
    this.showInfo = true;
  }
}
