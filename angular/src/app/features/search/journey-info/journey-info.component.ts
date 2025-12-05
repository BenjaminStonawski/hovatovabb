import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-journey-info',
  standalone: false,
  templateUrl: './journey-info.component.html',
  styleUrls: ['./journey-info.component.css']
})
export class JourneyInfoComponent implements OnInit {
  @Input() journey: any = null; // teljes journey (több szakasz)
  @Input() date: string = "";  // selectedDate
  @Output() close = new EventEmitter<void>();
  stops: any[] = [];

  loading = false;
  error = '';

  constructor(private search: SearchService) { }

  ngOnInit() {
    if (!this.journey) return;
    this.loadAllSegments();
  }

  async loadAllSegments() {
    this.loading = true;

    for (const seg of this.journey.nativeData) {
      try {
        const res = await firstValueFrom(
          this.search.getRunDescription(seg.RunId, seg.DepartureStation, seg.ArrivalStation, this.date)
        );

        this.stops.push({
          segment: seg,
          stops: Object.values(res || {})
        });
      } catch (err) {
        this.error = "Nem sikerült betölteni a megállókat.";
      }
    }

    this.loading = false;
  }

  getSegmentIcon(segment: any): string {
    const mode = (segment.TransportMode || segment.Mode || "").toLowerCase();

    if (mode.includes("bus") || mode.includes("volan") || mode.includes("agglo"))
      return "icons/bus.svg";

    if (mode.includes("tram"))
      return "icons/tram.svg";

    if (mode.includes("metro"))
      return "icons/metro.svg";

    return "icons/train.svg"; // default
  }

  onClose() {
    this.close.emit();
  }
}
