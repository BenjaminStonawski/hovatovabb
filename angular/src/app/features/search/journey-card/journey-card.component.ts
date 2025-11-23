import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-journey-card',
  standalone: false,
  templateUrl: './journey-card.component.html',
  styleUrls: ['./journey-card.component.css']
})
export class JourneyCardComponent {
  @Input() journey: any;

  // állapot: kibontva vagy sem
  showSegments = false;

  // hány átszállás (szakaszok - 1)
  get transfers(): number {
    return Math.max(0, (this.journey?.nativeData?.length ?? 1) - 1);
  }

  // gyűjtse össze a járműtípusokat (unique), pl. vehicles.bus, vehicles.train...
  get vehicleModes(): string[] {
    const arr = this.journey?.nativeData ?? [];
    const modes: string[] = [];
    arr.forEach((s: any) => {
      const m: string = s?.TransportMode ?? s?.Mode ?? '';
      if (!m) return;
      // próbáljuk a konkrét kulcsot kiragadni (pl. vehicles.bus)
      if (!modes.includes(m)) modes.push(m);
    });
    return modes;
  }

  // ikon választás egyszerű mappinggel
  iconForMode(mode: string) {
    const m = String(mode || '').toLowerCase();
    if (m.includes('bus') || m.includes('volan') || m.includes('agglo')) return 'icons/bus.svg';
    if (m.includes('tram')) return 'icons/tram.svg';
    if (m.includes('metro')) return 'icons/metro.svg';
    // vonatszerű
    return 'icons/train.svg';
  }

  format(t: any): string { 
    const h = Math.floor(t / 60); 
    const m = t % 60; 
    const ora = parseInt(String(h).padStart(2, '0'));

    let oraStr;
    if (ora < 10) {
      oraStr = `0${ora}`;
    }
    else {
      oraStr = String(ora);
    }

    const perc = String(m).padStart(2, '0');

    if (ora >= 24) {
      const masnapOra = -1* (ora - 24);
      if (masnapOra < 10) {
        return `0${masnapOra}:${perc}`;
      }
      else {
        return `${masnapOra}:${perc}`;
      }
    }
    return `${oraStr}:${perc}`;
  };

  toggleSegments() {
    this.showSegments = !this.showSegments;
  }
}