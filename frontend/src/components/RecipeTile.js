import { Link } from 'react-router-dom';

import './RecipeTile.css'
import '../App.css';

const RecipeTile = ({ recipe }) => {
    const updateOrderStatus = (e) => {
        const tile = e.currentTarget;
        tile.classList.toggle('ordered');
    }

    return (
        <div className='recipe-tile v-stack-fill h-auto' onClick={(e) => updateOrderStatus(e)}>
            <div className="v-grow-scroll d-flex align-items-center justify-content-center">
                {recipe.name}
            </div>
            <div className="d-flex justify-content-center">
                <Link to={"/recipes/edit/" + recipe.id}>
                    Edit
                </Link>
            </div>
        </div>

    );
};

export default RecipeTile;
