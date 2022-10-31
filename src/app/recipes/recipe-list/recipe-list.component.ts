import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: Router,
    private currentRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    /* Whenever there is any change in recipe and this component gets loaded, it will listen to that change
    event and update the recipes array accordingly. */
    this.subscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
    /* Fetching all the recipes from the recipe service when this component is loaded. We will get the copy
    of the original Array. */
    this.recipes = this.recipeService.getRecipe();
  }

  /* Programmatically navigating to 'new' path to create a new recipe. We are already on the '/recipes/ path
  and hence we will provide a relative path i.e. 'new'. ActivatedRoute helps us to inform the router about
  the current route. We use relativeTo to point to the current route through ActivatedRoute. */
  onNewRecipe() {
    this.route.navigate(['new'], {relativeTo: this.currentRoute});
  }

  /* To avoid any memory leak, we will unsubscribe the subscription made to recipechanged subject coming
  from the service. */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
