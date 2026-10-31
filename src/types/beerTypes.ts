export interface IBeer {
  id: number;
  name: string;
  tagline: string;
  first_brewed?: string;
  description: string;
  image?: string;
  image_url: string;
  abv?: number;
  ibu?: number;
  ingredients?: IIngredients;
  food_pairing?: string[];
}

export interface IIngredients {
  malt?: IIngredient[];
  hops?: IHop[];
  yeast?: string;
}

export interface IIngredient {
  name: string;
  amount: { value: number; unit: string };
}

export interface IHop extends IIngredient {
  add: string;
  attribute: string;
}
