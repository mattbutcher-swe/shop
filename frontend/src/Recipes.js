import './App.css';
import { Link } from 'react-router-dom';

function Recipes() {
  return (
    <div className="App">
    <Link to="/recipes/add">
        <button>
            Add
        </button>
    </Link>
      Recipes
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  );
}

export default Recipes;
