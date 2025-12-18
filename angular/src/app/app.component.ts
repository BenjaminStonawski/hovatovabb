import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'hovatovabb';
  activeTab: 'search' | 'plan' | 'details' = 'search';
  
  constructor(public userService: UserService, public alertService: AlertService) { }

  get user$() {
    return this.userService.user$;
  }

  showLogin = false;
  showRegister = false;
  showUser = false;

  logout() {
    this.userService.logout();
  }

  selectedPlan: any = null;

  openPlan(plan: any) {
    this.selectedPlan = plan;
    this.activeTab = 'details';
  }

  backToPlans() {
    this.selectedPlan = null;
    this.activeTab = 'plan';
  }

  logoutBtn() {
    this.userService.logout();
    this.alertService.show('Sikeresen kijelentkeztél!');
  }
}
