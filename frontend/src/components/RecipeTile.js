import './RecipeTile.css'

const RecipeTile = ({ recipe }) => {
    return (
        <div className="recipe-tile d-flex align-items-center justify-content-center">
            {recipe.name}
        </div>
    );
};

export default RecipeTile;
