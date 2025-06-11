import { useParams } from 'react-router-dom';
import RecipeForm from './RecipeForm';

function EditRecipe() {
  const { id } = useParams();
  return <RecipeForm recipeId={id} />;
}

export default EditRecipe;
