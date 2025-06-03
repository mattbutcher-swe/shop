import './App.css';

function AddRecipe() {
  return (
    <div className="App">
      Add Recipe
      <form>
        Name
        <input type="text" name="name"></input>
        Ingredients
      </form>
    </div>
  );
}

export default AddRecipe;
