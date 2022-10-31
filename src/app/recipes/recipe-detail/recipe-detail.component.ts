import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private currentroute: ActivatedRoute, /* Activated route will help us to fetch the id for the selected
    recipe from the router when the recipe is selected. */
    private route: Router
    ) { }

  ngOnInit() {

    /* ------------------------------------------------------------------------------------------------ */
      /* snapshot can be used but this will give us the id only the first time we load the detail component.
      In our case we can always select the recipe while the detail component is loaded as recipe-list is on
      the left and detail component is on the right. In that case snapshot is not suitable because it wont
      react on multiple selections. */
      // this.id = this.currentroute.snapshot.params['id'];
    /* ------------------------------------------------------------------------------------------------ */

    /* For multiple selections, we would subscribe to the params observable so that we can react to any
    changes to the route params and we will recieve the data of type params which would hold the id. So we
    can fetch the id from here into id property created but this will be of type string and id property is
    of type number. So it is type casted into a number by adding a + sign. Now we will add a method into
    recipe service. The params observable doesnt need to be cleared as it is managed by angular. So would
    clean it up. */
    this.currentroute.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipes(this.id);
    });
  }

  /* The method called from the recipe service would take the ingredient array from the recipe data as an
  argument and help in adding the ingredient to the shopping list ingredient array. */
  onAddingIngredients() {
    this.recipeService.onAddingIngToShopList(this.recipe.ingredients);
  }

  /* Programmatically navigate to the 'edit' path from the current id. */
  onEditRecipe() {
    this.route.navigate(['edit'], {relativeTo: this.currentroute});
  }

  /* Used to delete the recipe based on the selected index. After delete operation is done we will move out
  of the page, otherwise we will still see the deleted item on this page. */
  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.route.navigate(['../'], {relativeTo: this.currentroute});
  }

}
