export interface NutritionData {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  is_food: boolean;
}

export interface AnalysisState {
  isLoading: boolean;
  data: NutritionData | null;
  error: string | null;
  imagePreview: string | null;
}