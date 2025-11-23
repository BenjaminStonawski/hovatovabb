import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  activeTab: 'search' | 'plans' | 'details' = 'search';

  selectedPlan: any = null;

  openPlan(plan: any) {
    this.selectedPlan = plan;
    this.activeTab = 'details';
  }

  backToPlans() {
    this.selectedPlan = null;
    this.activeTab = 'plans';
  }
}
