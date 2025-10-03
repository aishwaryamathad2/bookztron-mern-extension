import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode"
import LibraryIllustration from "../../Assets/Images/Library_Illustration_1.jpg"
import './Home.css'
import {  
  useWishlist,
  useCart 
} from "../../index.js"

import { useProductAvailable } from "../../Context/product-context"
import { useGenre } from "../../Context/genre-context"
import { GenreCard } from "../../Components/GenreCards/GenreCard.js";
import { Footer } from "../../Components/Footer/Footer.js";


function Home() {
  const { dispatchProductFilterOptions } = useProductAvailable()
  const { dispatchUserWishlist } = useWishlist()
  const { dispatchUserCart } = useCart()
  const {
    setFictionCategoryCheckbox,
    setThrillerCategoryCheckbox,
    setTechCategoryCheckbox,
    setPhilosophyCategoryCheckbox,
    setRomanceCategoryCheckbox,
    setMangaCategoryCheckbox, 
  } = useGenre()

  const { pathname } = useLocation();
  //const [books, setBooks] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(()=> {
    const token=localStorage.getItem('token')
    if(token) {
      const user = jwt_decode(token)
      if(!user) {
        localStorage.removeItem('token')
      } else {
        (async function getUpdatedWishlistAndCart(){
          try {
            let updatedUserInfo = await axios.get(
              "http://localhost:5000/api/users/me",
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if(updatedUserInfo.data.status==="ok") {
              dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: updatedUserInfo.data.user.wishlist})
              dispatchUserCart({type: "UPDATE_USER_CART",payload: updatedUserInfo.data.user.cart})
            }
          } catch(err) {
            console.error("User fetch error", err)
          }
        })()
      }
    }   
  },[dispatchUserCart, dispatchUserWishlist]);

  /*useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`);
        setBooks(res.data.books);
      } catch (err) {
        console.error("Error fetching books", err);
      }
    }
    fetchBooks()
  }, [])*/

  return (
    <div className='home-component-container'>
      <div className='home-page-img-container'>
        <img className="home-page-background-img" src={LibraryIllustration} alt="Library Illustration"/>
      </div>

      <h1 className='homepage-headings'>Genres</h1>
      <div className='genre-cards-container'>
       <Link to={"/shop"} state={{ category: "Fiction" }}>
  <GenreCard genretype="Fiction" />
</Link>

<Link to={"/shop"} state={{ category: "Thriller" }}>
  <GenreCard genretype="Thriller" />
</Link>

<Link to={"/shop"} state={{ category: "Tech" }}>
  <GenreCard genretype="Tech" />
</Link>

<Link to={"/shop"} state={{ category: "Philosophy" }}>
  <GenreCard genretype="Philosophy" />
</Link>

<Link to={"/shop"} state={{ category: "Romance" }}>
  <GenreCard genretype="Romance" />
</Link>

<Link to={"/shop"} state={{ category: "Manga" }}>
  <GenreCard genretype="Manga" />
</Link>

      </div>

      <Link to={"/shop"}>
        <button 
          onClick={()=>{
            setFictionCategoryCheckbox(true)
            setThrillerCategoryCheckbox(true)
            setTechCategoryCheckbox(true)
            setPhilosophyCategoryCheckbox(true)
            setRomanceCategoryCheckbox(true)
            setMangaCategoryCheckbox(true)
            dispatchProductFilterOptions({type:"RESET_DEFAULT_FILTERS"}) }  
          }
          className="solid-secondary-btn homepage-explore-all-btn">
          Explore All
        </button>
      </Link>

      <Footer/>
    </div>
  )
}

export default Home 
