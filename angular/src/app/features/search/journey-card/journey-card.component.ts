import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-journey-card',
  standalone: false,
  templateUrl: './journey-card.component.html',
  styleUrls: ['./journey-card.component.css']
})
export class JourneyCardComponent {
  @Input() journey: any;
  @Input() kedvId: number = 3;
  @Output() info = new EventEmitter<any>();

  openInfo() {
    this.info.emit(this.journey);
  }

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
      let masnapOra = -1 * (ora - 24);
      if (masnapOra < 0) {
        masnapOra = masnapOra * -1;
        if (masnapOra < 10) {
          return `0${masnapOra}:${perc}`;
        }
      }
      else {
        if (masnapOra < 10) {
          return `0${masnapOra}:${perc}`;
        }
        else {
          return `${masnapOra}:${perc}`;
        }
      }
    }
    return `${oraStr}:${perc}`;
  };

  toggleSegments() {
    this.showSegments = !this.showSegments;
  }

  ownerColor(owner: string): string {
    if (!owner) return '#1e293b';

    if (owner.startsWith('BKK')) return '#4c0e5f';
    if (owner.startsWith('VOLÁN')) return '#995400';
    if (owner.startsWith('MÁV')) return '#1e40af';

    return '#00520a';
  }

  getJourneyOwners(): string[] {
    const owners = this.journey?.nativeData
      ?.map((s: any) => s.OwnerName)
      .filter(Boolean) ?? [];

    return Array.from(new Set(owners));
  }

  getTransportBackground(): string {
    const owners = this.getJourneyOwners();

    // csak egy szolgáltató
    if (owners.length <= 1) {
      return this.ownerColor(owners[0] || '');
    }

    // több szolgáltató
    const colors = owners.map(o => this.ownerColor(o));

    return `linear-gradient(to bottom, ${colors.join(', ')})`;
  }

  private isVolanJourney(): boolean {
    const owners = (this.journey?.nativeData ?? [])
      .map((s: any) => String(s?.OwnerName ?? '').toUpperCase());
    return owners.some((o: string) => o.includes('VOLÁN') || o.includes('VOLAN'));
  }

  calcFare(): number | null {
    // nálad a fő kártyán általában az első szegmens Fare-ja van kiírva
    const fare = Number(this.journey?.nativeData?.[0]?.Fare ?? 0);
    if (!fare || fare <= 0) return null;

    // kedvezmény csak VOLÁN-ra
    if (!this.isVolanJourney()) return fare;

    if (this.kedvId === 1) return 0;
    if (this.kedvId === 2) return Math.round(fare * 0.5);
    return fare; // 3
  }

  calcFareForSegment(seg: any): number | null {
    const fare = Number(seg?.Fare ?? 0);
    if (!fare || fare <= 0) return null;

    const owner = String(seg?.OwnerName ?? '').toUpperCase();
    const isVolan = owner.includes('VOLÁN') || owner.includes('VOLAN');

    // kedvezmény csak VOLÁN-ra
    if (!isVolan) return fare;

    if (this.kedvId === 1) return 0;
    if (this.kedvId === 2) return Math.round(fare * 0.5);
    return fare; // kedvId 3
  }
}