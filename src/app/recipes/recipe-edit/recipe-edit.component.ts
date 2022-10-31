import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipes.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode = false;
  recipeForm: FormGroup; // recipeForm is of type FormGroup

  constructor(
    private currentRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
    ) { }

  ngOnInit() {
    /* fetching the id through activatedroute */
    this.currentRoute.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null; /* If the id exists then editMode will be true otherwise it will
      be false which means this component will be used to create a new recipe and not edit the existing one. */
      this.initForm();
    });
  }

  // getter method to get access to ingredients array in form control
  get ingredientsControl() {
    return ((this.recipeForm.get('ingredients') as FormArray).controls);
  }

  /* This method will be responsible for the initialization of the reactive form. So if it is in edit mode,
  The recipe values will be populated into the form fields and if a new recipe is being created, then the
  form fields will be blank with the form controls assigned to the fields. */
  private initForm() {

    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    /* recipeIngredients is an array of ingredients for a particular recipe to be mapped to the form. This is
     declared as a form array which is initialized to be a null array. */
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      /* If we are in edit mode, a new recipe is created based on the id fetched in the init lifecycle
      hook */
      const recipe = this.recipeService.getRecipes(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      /* If a recipe contains ingredients, we would iterate through the ingredients of the recipe and push
      the ingredients to the formarray created above. This ingredient would contain the name and amount. so
      it needs to be pushed in the form of a group called form group. */
      if (recipe['ingredients']) {
        for (let ing of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name' : new FormControl(ing.name, Validators.required),
              'amount' : new FormControl(ing.amount, [Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    /* As recipeForm is of type form group, a new form group is created to create a new form (recipeForm)
  which is a JS object having key and value for the controls to be registered. */
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients // this is the form array created above.
    });
  }

  onAddIngredient() {
    /* For typescript to notice that ingredients is an array in the recipe form, we will typecast this to
    <FormArray>. Now this (<FormArray>this.recipeForm.get('ingredients')) whole statement is treated as a
    form array. A new ingredient in the form of a group is pushed in the existing array.*/
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  /* Delete the ingredient based on index. */
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onSubmit() {

    const newRecipe = new Recipe(
      /* while creating a new recipe add the values of the form in the Recipe constructor arguments. */
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']);

    if (this.editMode) {
      /* If the form is in edit mode, then then the recipe at the given index is updated. */
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      /* Otherwise a new recipe is added to the database. */
      this.recipeService.addRecipe(newRecipe);
    }

    /* To navigate away from this location once submission is done. */
    this.onCancel();
  }

  /* Navigate and go up one level in routing page. */
  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.currentRoute});
  }

}
