import './App.css';

function AddRecipe() {
  return (
    <div className="App">
      Add Recipe
        <form>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="name"/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" id="description"/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Ingredients</label>
            <div className="col-sm-10 d-flex justify-content-end">
              <button type="button" onClick={appendNewIngredientInput} className="btn btn-primary">+</button>            
            </div>
          </div>
          <div id='ingredients'>
          </div>
        </form>
    </div>
  );
}

function appendNewIngredientInput() {
  const ingredientsDiv = document.getElementById('ingredients');
  const test = document.createElement('p');
  test.innerHTML = "test";
  ingredientsDiv.appendChild(test);
}

export default AddRecipe;
