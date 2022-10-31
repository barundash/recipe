import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private ingsubjectsub: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    /* ---------- Fetch the ingredients from the service --------- */
    this.ingredients = this.slService.getIngredients();
    /* ----------------------------------------------------------- */

    /* ------------------------------------------------------------------------------------------------ */
    /* So whenever the ingredients array change we will fetch them from the service and the ingredients
    variable will be overwritten by this new changed data and will be seen on the output. */
    this.ingsubjectsub = this.slService.ingredientChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    /* ------------------------------------------------------------------------------------------------ */
    });
  }

  /* As we are subscribing to the ingredientChanged subject which is an observable created by us, we need
  to destroy it, otherwise it will remain on that observable and keep executing to attain wierd outputs. */
  ngOnDestroy() {
    this.ingsubjectsub.unsubscribe();
  }

  /* This method will help in editing the ingredient on selecting it. We will send the id of the ingredient
  selected to the shopping edit component. The startedEditing subject in the service will be called here so
  that it can emit the index. This will now be called in the shopping edit component to subscribe to this
  subject and retrieve the index there for editing in ngOnInit. */
  onEditIngredient(id: number) {
    this.slService.startedEditing.next(id);
  }

}
