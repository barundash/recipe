import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  // -----------------Creating Ingredients Array------------------------------
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)];
  // ------------------------------------------------------------------------

  /* The method would return a copy of ingredients array to be accessed outside this service. But using
  slice has one demerit. If we want to add an ingredient or delete an ingredient, it is done in the
  original array that is being fetched from database. But we are using slice of the original array to show
  it on the browser which doesn't contain the changes when it was called earlier. So to counter it we can
  remove slice. But here we don't do that, rather we introduce a variable called ingredientChanged. This
  variable would emit data of type ingredient array. Let's see how we use it in addIngredient method.*/
  getIngredients() {
    return this.ingredients.slice();
  }

  /* To add the ingredient coming into the method argument to the ingredient array through push command.
  This method would be called in shopping edit component. */
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    /* Whenever the ingredients array is changed here, the ingredientChanged variable emits the copy of the
    original ingredients array. So the other components accessing this array are aware of the change made to
    this array. Now to get this to work we implement it in ngOnInit method of shopping list component. */
    this.ingredientChanged.next(this.ingredients.slice());
  }

  /* This method is used to fetch the ingredient to be edited based on the id. This method is called in
  shoping edit component when that component is loaded. */
  getIngredient(id: number) {
    return this.ingredients[id];
  }

  /* This method will help in appending more than one ingredients basically a list of ingredients into
  ingredients array. This will be useful for adding the ingredients from the selected recipe to the shopping
  list ingredient array. Basically this will be a cross component communication. We wont use a for loop to
  traverse through the argument list and append. Rather, we will use the spread operator to push the
  ingredients to the array. This is a ES6 feature of JavaScript to spread the elements of an array. Now, for
  this change to be reflected, ingredientChanged variable will emit the changed data. This method will be
  called in the recipe service using dependency injection. */
  appendIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientChanged.next(this.ingredients.slice());
  }

  /* This method will help us in deleting the ingredient selected based on index. Then the copy of an updated
  array will be sent to be subscribed within shopping-list component. This method is called in shopping-edit
  component. */
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientChanged.next(this.ingredients.slice());
  }

  /* This method is used to update the ingredient selected with a new value. It recieves index and ing as
  arguments and that particular index is overwritten with an new ingredient which is coming in as an argument.
  When the ingredient array has changed, a copy is emitted through this subject, which is subscribed in the
  shopping-list component ngOnInit. This method is called in shoping-edit component. Athough the change is
  in shopping edit component, this component is a child of shopping-list component which is routed/ loaded
  whenever there is a change to shopping edit component. Hence ingredientsChanged will be subscribed
  automatically within ngOnInit block of shopping-list component.*/
  updateIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
    this.ingredientChanged.next(this.ingredients.slice());
  }

}
