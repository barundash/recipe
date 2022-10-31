import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipes.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth-component/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageServeice {

  constructor(private http: HttpClient, private recipeservice: RecipeService,
    private authService: AuthService) {}

  /* This method helps in storing the recipe array into the firebase database through PUT request. Everytime
  this request is triggerred, an update action happens which will overwrite the existing setup and update
  with a new array. This method is called in the header component. We subscribe here, because we don't need
  the response in any other component as this just saves the data. */
  storeRecipes() {
    /* Here the recipe list is fetched from the existing array. */
    const recipes = this.recipeservice.getRecipe();
    this.http.put('https://recipe-app-c241a.firebaseio.com/recipes.json', recipes)
    .subscribe(response => {
      console.log(response);
    });
  }

  /* This method is used to fetch the recipes from the backend database. We wont subscribe to the request
  here, because we are interested in the response from the GET request in header component. So we just return
  the observable created out of this GET request. */
  fetchRecipes() {
    /* A generic type "Recipe[]" is provided to the get request, so that the data manupulated after getting
    the response body is known to be of Recipe[] type, otherewise accessing that data will thorw an error
    pertaining to unknown data type. */
    return this.http.get<Recipe[]>('https://recipe-app-c241a.firebaseio.com/recipes.json'
    /* Whenever we add a new recipe, or update a recipe and dont add ingredients, the data stored in the
    database won't contain ingredients array. But ingredients array is one of the attributes of recipes
    array. So when accessing the data form database we need to have all the attributes here. So even if there
    is no ingredient, an empty array should be used here. So we would use map operator to transform the data.
    It recieves recipes which might not have ingredient property. Now recipes.map() is an array method in
    javascript and not an RXJS method for observables. This map will allow the transformation of elements in
    an array.
    recipes.map() takes an anonymous function which is executed for every element in an array. This would
    return a transformed recipe. We will use spread operator of the recipe to access all the attributes of
    the recipe and check if it contains ingredient the use this ingredient otherwise send an empty array.
    */
    ).pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
      /* the tap operator allows us to execute some code in place without altering the data coming through
      the observable. */
    }), tap(recipes => {
      this.recipeservice.setRecipes(recipes);
    }));

  }

}
