import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';



@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {


  constructor(private shoppingListService: ShoppingListService) { }
  @ViewChild('f', {static: false}) slform: NgForm; /* slForm will have access to the form and its values. */
  subscription: Subscription;
  editmode = false; // editMode is used to mark whether we are updating an ingredient or creating a new one.
  editedItemIndex: number;
  editedItem: Ingredient;

  ngOnInit() {
    /* By subscribing to the startedEditing subject from shopping list comp, we can fetch the index of the
    ingredient selected for editing when this component is edited. This subject is created by us, so when
    we subscribe to it, we should destroy it also to ensure that there is no memory leak.*/
    this.subscription = this.shoppingListService.startedEditing.subscribe((id: number) => {
      this.editedItemIndex = id;
      this.editmode = true; // This is an edit mode.
      this.editedItem = this.shoppingListService.getIngredient(id); /* editedItem will fetch the ingredient
      coming in from the shopping list service based on the id selected. */

      /* This will set the values of the form based on the ingredient selected. So whenever an ingredient is
      selected, the form field will be set with the values of the selected ingredient of editing. */
      this.slform.setValue(
        {
          name: this.editedItem.name,
          amount: this.editedItem.amount
        }
      );
    });
  }

  onAddItem(form: NgForm) {

    const value = form.value;

    //creation of new ingredient
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editmode) {
      /* This method is called from the shopping list service which recieves the index and the new created
      ingredient here as an argument to update the ingredient. */
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      /* Add the new ingredient created here by calling the addingredient method from the shopping list
      service. */
      this.shoppingListService.addIngredient(newIngredient);
    }
    /* The moment update operation is performed, the component should leave the edit mode because update
    operation has been completed. And also the form fields should be clear now. */
    this.editmode = false;
    form.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* This function would help in resetting the form with editMode not being there. */
  onClear() {
    this.slform.reset();
    this.editmode = false;
  }

  /* This method will be used to call the method from the service to delete the ingredient base on the item
  selected. And once done, we will clear the form, which includes editMode to be false. */
  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
