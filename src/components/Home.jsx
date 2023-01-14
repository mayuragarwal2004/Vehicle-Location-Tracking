import React from 'react'
import { Link } from 'react-router-dom';
import "./css/home.css";

const Home = () => {
  return (
    <>
      <div className='home-main'>
        <div className='home-main-child'>
          Hello World
        </div>
        <Link to="/maps">Go to maps</Link>
      </div>
    </>
  )
}

export default Home