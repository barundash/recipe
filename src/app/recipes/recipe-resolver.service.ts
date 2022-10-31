import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Recipe } from './recipes.model';
import { DataStorageServeice } from '../shared/data-storage.service';
import { RecipeService } from './recipes.service';


/* When we reload the recipe detail page, as we are fetching the recipe from the back end, this might throw
an error as there is no recipe array available here. So as a remedy, this resolver is used. This will
implement resolve interface. Resolve interface is a generic interface which means what kind of data we need
to resolve, which will be recipe[] in our case. */

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private datastorageservice: DataStorageServeice, private recipeService: RecipeService) {}

  /* Resolve interface has a method resolve which needs to be implemented here. This method gets the data
  about the route and the current routing state. This will call the fetchrecipes method of the data storage
  service to fetche the data. We are not subscribing to the fetchrecipes as resolve() will automatically
  do it. Now we need to apply this resolver in the routing module. */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const recipes = this.recipeService.getRecipe();

    /* Only in case of reloading, recipes will be fetched from the database, otherwise the data that is
    being used is shown, as this resolver is applied to the respective routes. */
    if (recipes.length === 0) {
      this.datastorageservice.fetchRecipes();
    } else {
      return recipes;
    }
    return this.datastorageservice.fetchRecipes();
  }

}
