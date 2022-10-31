import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageServeice } from '../shared/data-storage.service';
import { AuthService } from '../auth-component/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private usersubscription: Subscription;
  isAuthenticated = false;
  navbarOpen = false;

  constructor(private datastorageservice: DataStorageServeice, private authService: AuthService) {}

  ngOnInit() {
    /* Subject subscription should be managed by us. This subscribes the user subject and if the user exists
    the isAuthenticated is set to true else false. To clear this subscription we would ue ngondestroy */
    this.usersubscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = user ? true : false;
      console.log(this.isAuthenticated);
    });

  }

  navbarToggle() {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnDestroy() {
    this.usersubscription.unsubscribe();
  }

  /* This method calls the store recipes form data storage service to update the array in the firebase
  database. */
  onSaveData() {
    this.datastorageservice.storeRecipes();
  }

  /* This method is used to call the fetch recipes method of data storage service to fetch all the recipes. */
  onFetchData() {
    this.datastorageservice.fetchRecipes().subscribe();
  }

  /* Perform logout action by calling the logout function of auth service. */
  onLoggingOut() {
    this.authService.logout();
  }

}
