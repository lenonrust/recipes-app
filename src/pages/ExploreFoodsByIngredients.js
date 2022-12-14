import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import searchContext from '../context/searchContext';
import './ExploreIngredients.css';

const TWELV = 12;

function ExploreFoodsbyIngredients() {
  const [ingredients, setIngredients] = useState();
  const history = useHistory();
  const { setIngredient } = useContext(searchContext);

  const handleIngredients = async () => {
    const url = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';
    const response = await fetch(url);
    const { meals } = await response.json();
    setIngredients(meals);
  };

  useEffect(() => {
    handleIngredients();
  }, []);
  if (!ingredients) {
    return '';
  }

  const handleSearchIngredient = (ingredient) => {
    setIngredient(ingredient);
    history.push('/foods');
  };
  return (
    <div className="explore-ingredients-main-container">
      <Header title="Explore Ingredients" />
      <div className="explore-ingredients-section">
        { ingredients.slice(0, TWELV)
          .map((itr, index) => (
            <button
              className="ingredients-explore-buttons"
              key={ `food-ingredient${index}` }
              type="button"
              onClick={ () => handleSearchIngredient(itr.strIngredient) }
            >
              <div data-testid={ `${index}-ingredient-card` }>
                <img
                  className="ingredients-explore-image"
                  data-testid={ `${index}-card-img` }
                  src={ `https://www.themealdb.com/images/ingredients/${itr.strIngredient}-Small.png` }
                  alt={ itr.strIngredient }
                />
                <p
                  className="title-explore-ingredients"
                  data-testid={ `${index}-card-name` }
                >
                  {itr.strIngredient}
                </p>

              </div>
            </button>
          )) }
      </div>
      <Footer />
    </div>
  );
}

export default ExploreFoodsbyIngredients;
