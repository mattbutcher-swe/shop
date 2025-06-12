import { useParams } from 'react-router-dom';
import RecipeForm from './RecipeForm';

function EditRecipe() {
  const { id } = useParams();
  return <RecipeForm id={id} />;
}

export default EditRecipe;
