/* Recipe model defines the structure of recipe object coming in as a data and the data is publically
 accessible outside. So they are defined as public and are not encapsulated.*/

import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  // ingredients is added so that we can add ingredients to the recipe.
  public  ingredients: Ingredient[];

  // Constructor would help in instantiating the recipe object using a new keyword
  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
