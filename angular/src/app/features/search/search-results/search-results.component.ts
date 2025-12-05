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
  @Output() info = new EventEmitter<any>();

  onInfo(journey: any) {
    this.info.emit(journey);
  }
}
