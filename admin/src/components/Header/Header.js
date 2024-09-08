  import React from "react";
  import {
    BsFillBellFill,
    BsFillEnvelopeFill,
    BsPersonCircle,
    BsJustify,
  } from "react-icons/bs";
import './Header.css'

  function Header({ OpenSidebar }) {
    return (
      <header className="header">
        <div className="menu-icon">
          <BsJustify className="icon" onClick={OpenSidebar} />
        </div>
        <div className="header-left">
          <BsJustify className="icon" onClick={OpenSidebar}/>
        </div>
        <div className="header-right">
          <BsFillBellFill className="icon" />
          <BsFillEnvelopeFill className="icon" />
          <BsPersonCircle className="icon" />
        </div>
      </header>
    );
  }

  export default Header;
