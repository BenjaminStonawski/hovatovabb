import { Component, Input } from '@angular/core';
import { JourneyResult } from '../../../models.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: false
})
export class SearchResultsComponent {
  @Input() journeys: JourneyResult[] = [];
}
