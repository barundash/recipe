/* Recipe service is place where we would manage our recipes. So we would have recipes array over here which
 would be used for some manupulation. */

import { Recipe } from '../recipes/recipes.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable() // @injectable helps us to inject the shopping list service into this recipe service.
export class RecipeService {

  /* recipeChanged would have some Recipe data to be manupulated outside. This subject would be subscribed
  inside init() of list component to track any changes made to recipes array. */
  recipeChanged = new Subject<Recipe[]>();

  /*private recipes: Recipe[] = [
    new Recipe('Chilly Chicken',
    'Chilli chicken is a sweet, spicy & slightly sour crispy appetizer made with chicken, bell peppers, garlic, chilli sauce & soya sauce.',
    'https://www.indianhealthyrecipes.com/wp-content/uploads/2018/07/chilli-chicken-recipe-500x500.jpg',
    [new Ingredient('meat', 1), new Ingredient('Onion', 1), new Ingredient('Capsicum', 1), new Ingredient('Sauce', 3)]),
    new Recipe('Hakka Noodles',
    'Hakka noodles is a Chinese preparation where boiled noodles are stir fried with sauces and vegetables or meats.',
    'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Vegetable-Hakka-Noodles-Best-of-Chinese-Cooking.JPG',
    [new Ingredient('Noodles', 1), new Ingredient('Onion', 1), new Ingredient('Sauce', 3), new Ingredient('Tomato', 3)]),
    new Recipe('Andhra Boneless Chicken Biriyani',
    'Serve the biryani by not combining the contents of the biryani vessel. Hope this helps.',
    'https://media-cdn.tripadvisor.com/media/photo-s/0f/b3/71/52/special-boneless-chicken.jpg',
    [new Ingredient('meat', 1), new Ingredient('Onion', 3), new Ingredient('Rice', 1), new Ingredient('Spices', 5)])
  ];*/

  constructor(private slservice: ShoppingListService) {}

  private recipes: Recipe[] = [];

  /* When the GET request method is triggerred in data storage service, This method is called there to
  initialize the recipes array to be used for manupulation in the applicatiion. */
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  /* Get recipe method would return the recipe array so that we can get access to this array from outside as
   this is a private array. But we dont want to access this array from outside. So slice will help us send
   a brand new array which would be the exact copy of this original array and hence no manupulation can be
   made to this original array. Now we can fetch the recipes in the recipe-list component.*/
  getRecipe() {
    return this.recipes.slice();
  }

  /* We will fetch the recipes based on id and then this method will be called in the recipe-detail
   component. */
  getRecipes(index: number) {
    return this.recipes[index];
  }

  /* This method will add the ingredient to the shopping list array from the selected recipe. This method
     will be called in the recipe-detail component. */
  onAddingIngToShopList(ingredients: Ingredient[]) {
    this.slservice.appendIngredients(ingredients);
  }

  /* This method will be called in the onsubmit method of recipe-edit component. It will add the new recipe
  to the database. Use the recipechanged subject to send the slice of the original array.*/
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  /* This method is used to update the existing recipe at the particular index. This method will be called
   in the onsubmit method of recipe-edit component*/
  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  /* Used to delete the recipe based on index. This method will be called in recipe-detail component. Then
  recipechanged will emit the copy of the changed array so that all the components who are accessing the
  copy of the array will know about the change. */
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1); // 1 element to be removed from that index.
    this.recipeChanged.next(this.recipes.slice());
  }

}
