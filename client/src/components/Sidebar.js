import React from 'react';
import '../styles/sideBar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>DramaKu</h2>
      <ul>
        <li>
          <NavLink to="/dramas" activeClassName="active">Dramas</NavLink>
          <ul>
            <li>
              <NavLink to="/validate" activeClassName="active">Validate</NavLink>
            </li>
            <li>
              <NavLink to="/input-new-drama" activeClassName="active">Input New Drama</NavLink>
            </li>
          </ul>
        </li>
        <li><NavLink to="/countries" activeClassName="active">Countries</NavLink></li>
        <li><NavLink to="/awards" activeClassName="active">Awards</NavLink></li>
        <li><NavLink to="/genres" activeClassName="active">Genres</NavLink></li>
        <li><NavLink to="/actors" activeClassName="active">Actors</NavLink></li>
        <li><NavLink to="/comments" activeClassName="active">Comments</NavLink></li>
        <li><NavLink to="/users" activeClassName="active">Users</NavLink></li>
        <li><NavLink to="/logout" activeClassName="active">Logout</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
