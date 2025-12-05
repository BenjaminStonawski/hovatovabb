import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { forkJoin, map } from 'rxjs';

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

  delayLoading = false;

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

    // input border reset
    document.getElementById('search-from').querySelector("input").style.borderColor = "#374151";
    document.getElementById('search-to').querySelector("input").style.borderColor = "#374151";

    // fő loading
    this.loading = true;

    // 🔥 delay loading flag
    this.delayLoading = false;

    // dátum
    const dateToSend = this.selectedDate || new Date().toISOString().split("T")[0];

    // idő (HH:mm → óra + perc)
    const [hourString, minuteString] = (
      this.selectedTime || `${new Date().getHours()}:${new Date().getMinutes()}`
    ).split(":");

    const hourToSend = parseInt(hourString, 10);
    const minuteToSend = parseInt(minuteString, 10);

    this.search.searchRoutesCustom(this.from, this.to, dateToSend, hourToSend, minuteToSend)
      .subscribe({
        next: res => {
          this.loading = false; // a keresés befejeződött

          let arr = res || [];

          arr = arr.filter(j => {
            const seg = j.nativeData?.[0];
            const last = j.nativeData?.[j.nativeData.length - 1];

            if (!seg || !last) return false;
            if (!seg.DepartureTime || !last.ArrivalTime) return false;

            // DepartureTime / ArrivalTime numeric check
            if (isNaN(seg.DepartureTime) || isNaN(last.ArrivalTime)) return false;

            return true;
          });

          // ha a felhasználó nem engedi az átszállást, szűrjük
          if (!this.allowTransfers) {
            arr = arr.filter(j => (j.nativeData?.length ?? 1) === 1);
          }

          if (arr.length === 0) {
            // nincs találat → delay sem fog töltődni
            this.journeys = [];
            return;
          }

          // 🔥 most indul a késésadatok betöltése
          this.delayLoading = true;

          const date = dateToSend;

          forkJoin(
            arr.map(journey =>
              forkJoin(
                journey.nativeData.map(seg =>
                  this.search.getDelayInfo(seg.RunId, seg.DepartureStation, seg.ArrivalStation, date)
                )
              ).pipe(
                map(delayList => {
                  journey.delayInfo = delayList;
                  return journey;
                })
              )
            )
          ).subscribe(final => {

            // 🔥 késésadatok betöltődtek
            this.delayLoading = false;

            // késések alkalmazása indulási / érkezési időre
            final.forEach(journey => {
              const firstSegDelay = journey.delayInfo[0];
              const lastSegDelay = journey.delayInfo[journey.delayInfo.length - 1];

              const fromName = journey.indulasi_hely || firstSegDelay.stops?.[0]?.megallo;
              const toName = journey.erkezesi_hely || lastSegDelay.stops?.[lastSegDelay.stops.length - 1]?.megallo;

              const dep = this.pickDepartureFromSegment(firstSegDelay, fromName);
              const arr = this.pickArrivalFromSegment(lastSegDelay, toName);

              journey.realDeparture = dep.time;
              journey.realArrival = arr.time;
              journey.departureDelayed = dep.delayed;
              journey.arrivalDelayed = arr.delayed;
            });

            // rendezés valós indulási idő szerint
            final.sort((a, b) =>
              this.timeToMinutes(a.realDeparture) - this.timeToMinutes(b.realDeparture)
            );

            this.journeys = final;
          });
        },

        error: err => {
          this.loading = false;
          this.delayLoading = false;
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

  selectedJourneyInfo: any = null;

  openJourneyInfo(j: any) {
    console.log("INFO KATTINTVA:", j); // Most már MEG FOG JELENNI!
    this.selectedJourneyInfo = j;
  }

  closeJourneyInfo() {
    this.selectedJourneyInfo = null;
  }

  timeToMinutes(t: string): number {
    if (!t) return 99999;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  private cleanTime(v: any): string {
    if (!v) return "";
    const s = String(v).trim().toLowerCase();
    if (s === "n.a" || s === "n.a." || s === "n.a ") return "";
    return String(v).trim();
  }

  private pickDepartureFromSegment(segmentDelay: any, stopName: string): { time: string; delayed: boolean } {
    const stops = segmentDelay.stops || [];
    const found = stops.find((s: any) => s.megallo === stopName);

    if (found) {
      const vd = this.cleanTime(found.varhato_indul);
      const sd = this.cleanTime(found.indul);

      if (vd) return { time: vd, delayed: true };
      if (sd) return { time: sd, delayed: false };
    }

    // ha nem találtuk a megállót, essünk vissza a szakasz aggregált adataira
    const vd = this.cleanTime(segmentDelay.expectedDeparture);
    const sd = this.cleanTime(segmentDelay.scheduledDeparture);

    if (vd) return { time: vd, delayed: segmentDelay.hasDepartureDelay };
    return { time: sd, delayed: false };
  }

  private pickArrivalFromSegment(segmentDelay: any, stopName: string): { time: string; delayed: boolean } {
    const stops = segmentDelay.stops || [];
    const found = stops.find((s: any) => s.megallo === stopName);

    if (found) {
      const va = this.cleanTime(found.varhato_erkezik);
      const sa = this.cleanTime(found.erkezik);

      if (va) return { time: va, delayed: true };
      if (sa) return { time: sa, delayed: false };
    }

    const va = this.cleanTime(segmentDelay.expectedArrival);
    const sa = this.cleanTime(segmentDelay.scheduledArrival);

    if (va) return { time: va, delayed: segmentDelay.hasArrivalDelay };
    return { time: sa, delayed: false };
  }

}