import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-plan',
  standalone: false,
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {
  constructor(private userService: UserService) { }

  get user$() {
    return this.userService.user$;
  }

  showLogin = false;
}
