import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  from: any = null;
  to: any = null;
  journeys: any[] = [];
  loading = false;
  error = '';
  allowTransfers = true;
  selectedDate: string = '';
  selectedTime: string = '';
  dateValue: string = '';
  timeValue: string = '';

  ngOnInit() {
    const now = new Date();

    // YYYY-MM-DD
    this.dateValue = now.toISOString().slice(0, 10);

    // HH:MM
    this.timeValue = now.toTimeString().slice(0, 5);
  }


  constructor(private search: SearchService) { }

  onSelectFrom(s: any) { this.from = s; }
  onSelectTo(s: any) { this.to = s; }

  onSwap() {
    const t = this.from;
    this.from = this.to;
    this.to = t;
    document.getElementById('search-from').querySelector("input").value = this.from?.lsname ?? '';
    document.getElementById('search-to').querySelector("input").value = this.to?.lsname ?? '';
  }

  kereses = false;
  onSearch() {
    this.error = '';
    this.journeys = [];

    if (!this.from || !this.to) {
      document.getElementById('search-from').querySelector("input").style.borderColor = "#f87171";
      document.getElementById('search-to').querySelector("input").style.borderColor = "#f87171";
      this.error = 'Válassz indulási és érkezési állomást!';
      return;
    }

    this.loading = true;
    document.getElementById('search-from').querySelector("input").style.borderColor = "#374151";
    document.getElementById('search-to').querySelector("input").style.borderColor = "#374151";

    // dátum
    const dateToSend = this.selectedDate || new Date().toISOString().split("T")[0];

    // idő (HH:mm → óra + perc)
    const [hourString, minuteString] = (this.selectedTime || `${new Date().getHours()}:${new Date().getMinutes()}`).split(":");
    const hourToSend = parseInt(hourString, 10);
    const minuteToSend = parseInt(minuteString, 10);

    this.search.searchRoutesCustom(this.from, this.to, dateToSend, hourToSend, minuteToSend)
      .subscribe({
        next: res => {
          this.loading = false;

          let arr = res || [];

          if (!this.allowTransfers) {
            arr = arr.filter(j => (j.nativeData?.length ?? 1) === 1);
          }

          this.journeys = arr;
        },
        error: err => {
          this.loading = false;
          this.error = err?.message ?? 'Hiba történt';
        }
      });

    this.kereses = true;
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.selectedTime = "00:00";
  }

  onTimeChange(event: any) {
    this.selectedTime = event.target.value;
  }
}