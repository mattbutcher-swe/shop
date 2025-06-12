import { Link } from 'react-router-dom';

import './RecipeTile.css'
import '../App.css';

const RecipeTile = ({ recipe }) => {
    return (
        <div className='recipe-tile v-stack-fill h-auto'>
            <div className="v-grow-scroll d-flex align-items-center justify-content-center">
                    {recipe.name}
            </div>
            <div className="d-flex">
                    <span className='w-50 text-center'>
                        <Link to={"/recipes/edit/" + recipe.id}>
                              Edit
                        </Link>
                    </span>
                    <span className='w-50 text-center'>Order</span>
            </div>
        </div>
        
    );
};

export default RecipeTile;
