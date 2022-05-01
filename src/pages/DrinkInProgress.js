import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
// import blackHeartIcon from '../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

const FIFTEEN = 15;

function DrinkInProgress(props) {
  const { match: { params: { id } } } = props;
  const [details, setDetails] = useState({});
  const [ingredient, setIngredient] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [displayClipboardMessage, setDisplayClipboardMessage] = useState(false);
  // const [favBtn, setFavBtn] = useState(false);
  const allIngredientsChecked = ingredientList.length === ingredient.length;
  const history = useHistory();

  const copyToShare = () => {
    setDisplayClipboardMessage(true);
    const url = window.location.href;
    copy(url.replace('/in-progress', ''));
  };

  // const verifyFavorite = () => {
  //   const localData = JSON.parse(localStorage.getItem('favoriteRecipes'));
  //   if (localData && localData.some((element) => element.id === id)) {
  //     setFavBtn(true);
  //   }
  // };

  const checkStorage = () => {
    const storageData = localStorage.getItem('inProgressRecipes');
    if (!storageData) {
      localStorage.setItem('inProgressRecipes', JSON.stringify(
        { meals: {}, cocktails: {} },
      ));
    }
  };

  const getFromStorage = () => {
    const storageData = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const ingredients = storageData.cocktails[id];
    if (ingredients) setIngredientList(ingredients);
  };

  const fromStateToStorage = () => {
    const storageData = JSON.parse(localStorage.getItem('inProgressRecipes'));
    storageData.cocktails[id] = ingredientList;
    localStorage.setItem('inProgressRecipes', JSON.stringify(storageData));
  };

  useEffect(() => {
    const searchMeals = async () => {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      setDetails(data.drinks[0]);
    };
    searchMeals();
    checkStorage();
    getFromStorage();
    // verifyFavorite();
  }, []);

  const filterIngredients = () => {
    const array = [];
    for (let index = 1; index <= FIFTEEN; index += 1) {
      if (details[`strIngredient${index}`] !== ''
        && details[`strIngredient${index}`] !== null) {
        array
          .push(`${details[`strIngredient${index}`]}: ${details[`strMeasure${index}`]}`);
      }
    }
    return array;
  };

  useEffect(() => {
    setIngredient(filterIngredients());
  }, [details]);

  useEffect(() => {
    fromStateToStorage();
    setDisplayClipboardMessage(false);
  }, [ingredientList]);

  // const updateLocalStorage = () => {
  //   localStorage.getItem('inProgressRecipes');
  // };

  const handleCheckbox = ({ target }) => {
    if (target.checked) {
      setIngredientList([...ingredientList, target.name]);
    } else {
      const newIngredientList = ingredientList
        .filter((element) => element !== target.name);
      setIngredientList([...newIngredientList]);
    }
  };

  // const favoriteRecipe = () => {
  //   const localData = JSON.parse(localStorage.getItem('favoriteRecipes'));
  //   const favoriteObject = {
  //     id: details.idDrink,
  //     type: 'drink',
  //     category: details.strCategory,
  //     alcoholicOrNot: details.strAlcoholic,
  //     name: details.strDrink,
  //     image: details.strDrinkThumb,
  //   };
  //   if (!localData) {
  //     localStorage.setItem('favoriteRecipes', JSON.stringify([favoriteObject]));
  //     setFavBtn(true);
  //   } else if (localData.some((element) => element.id === favoriteObject.id)) {
  //     localStorage.setItem('favoriteRecipes', JSON
  //       .stringify(localData.filter((data) => data.id !== favoriteObject.id)));
  //     setFavBtn(false);
  //   } else {
  //     localStorage.setItem('favoriteRecipes', JSON
  //       .stringify([...localData, favoriteObject]));
  //     setFavBtn(true);
  //   }
  // };
  const loadingValidation = ingredient[0] && ingredient[0] !== 'undefined: undefined';
  return (
    <>
      <img
        width="150px"
        height="150px"
        data-testid="recipe-photo"
        src={ details.strDrinkThumb }
        alt={ details.strDrink }
      />
      <h2 data-testid="recipe-title">{details.strDrink}</h2>
      <button
        data-testid="share-btn"
        type="button"
        onClick={ copyToShare }
      >
        <img src={ shareIcon } alt="shareIcon" />
      </button>
      <button
        data-testid="favorite-btn"
        type="button"
        // onClick={ favoriteRecipe }
      >
        <img src={ whiteHeartIcon } alt="whiteHeartIcon" />
        {/* { favBtn ? <img src={ blackHeartIcon } alt="blackHeartIcon" />
          : <img src={ whiteHeartIcon } alt="whiteHeartIcon" /> } */}
      </button>
      { displayClipboardMessage && <span>Link copied!</span> }
      <h3 data-testid="recipe-category">{details.strAlcoholic}</h3>
      {loadingValidation && ingredient.map((itr, index) => (
        <div key={ `ingredient${index}` }>
          <label
            data-testid={ `${index}-ingredient-step` }
            htmlFor={ `checkIngredient${index}` }
            style={ ingredientList
              .find((ingredien) => ingredien === itr) ? { textDecoration: 'line-through' }
              : { textDecoration: '' } }
          >
            <input
              id={ `checkIngredient${index}` }
              type="checkbox"
              name={ itr }
              onChange={ handleCheckbox }
              checked={ ingredientList.find((ing) => ing === itr) }
            />
            {itr}
          </label>
        </div>
      ))}
      <p data-testid="instructions">{details.strInstructions}</p>
      <button
        className="start-recipe-btn"
        data-testid="finish-recipe-btn"
        type="button"
        disabled={ !allIngredientsChecked }
        onClick={ () => history.push('/done-recipes') }
      >
        Finish Recipe
      </button>
    </>
  );
}

DrinkInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;

export default DrinkInProgress;