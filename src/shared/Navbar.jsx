import React from "react";
import { Link, useLocation } from "wouter";
import styled from 'styled-components';

import AppsIcon from '@material-ui/icons/Apps';
import PublicIcon from '@material-ui/icons/Public';
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import DescriptionIcon from '@material-ui/icons/Description';

const StyledNavbarContainer = styled.div`
  .logo-container {
    width: 100%;
    margin: 2rem 0;
  }
  .link {
    font-family: 'Roboto';
    color: gray;
    text-transform: uppercase;
    width: 100%;
    margin: 1rem;
  }

  .sidebar .sidebar__logo {
    width: 100%;
    height: 10rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
 }
  .sidebar .sidebar__logo img {
    width: 5rem;
    height: 5rem;
 }
  .sidebar .sidebar__logo h1 {
    font-size: 1.55rem;
    font-weight: 900;
    margin: 0;
    padding: 0;
    line-height: 0.75;
    margin-top: 0.5rem;
    color: #703bda;
 }
  .sidebar .sidebar__logo h4 {
    font-weight: bold;
 }
  .sidebar .sidebar__list {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 2rem;
 }
  .sidebar .sidebar__list .sidebar__list__item {
    color: #9fa5b8;
    font-weight: bold;
    padding: 0.5rem 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.25s ease;
 }
  .sidebar .sidebar__list .sidebar__list__item__active {
    font-weight: bold;
    padding: 0.5rem 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    color: white;
    background-color: #703bda;
    transition: all 0.25s ease;
 }
  .sidebar .sidebar__list .sidebar__list__item:hover {
    color: white;
    background-color: #703bda;
 }
  .sidebar .sidebar__list span {
    font-size: 0.8rem;
 }
  .sidebar .sidebar__list .sidebar__list__item__icon {
    margin-right: 0.8rem;
 }
  
  
`


const Navbar = () => {

  const [location, setLocation] = useLocation();


  const SidebarItem = (props) => {
    return (
      <Link href={props.item.link}>
        <li
          className={
            props.item.link === location
              ? "sidebar__list__item__active"
              : "sidebar__list__item"
          }
          onClick={() => setLocation(`/${props.item.link}`)}
        >
          <div className="sidebar__list__item__icon"> {props.icon}</div>
          <span>{props.item.name}</span>
        </li>
      </Link>
    );
  };

  const sidebarItem = [
    {
      name: "COMPARAR EVOLUCIÓN EN PAISES",
      link: "/",
      icon: <AppsIcon></AppsIcon>,
    },
    {
      name: "SITUACIÓN MUNDIAL",
      link: "/world-situation",
      icon: <PublicIcon></PublicIcon>,
    },
    {
      name: "VER ESTADÍSTICAS DE UN PAÍS",
      link: "/country/Uruguay",
      icon: <BarChartIcon></BarChartIcon>,
    },
    {
      name: "RANKING DE PAISES",
      link: "/ranking",
      icon: <PieChartIcon></PieChartIcon>,
    },
    {
      name: "TODOS LOS RANKINGS",
      link: "/all-rankings",
      icon: <DonutSmallIcon></DonutSmallIcon>,
    },
    {
      name: "FUENTES",
      link: "/information-source",
      icon: <DescriptionIcon></DescriptionIcon>,
    },
  ];



  return (
    <StyledNavbarContainer>
      <div className="logo-container">
        <img src="/logo.png" alt="Logo for corona app" />
      </div>

      <div className="sidebar">
        <ul className="sidebar__list">
          {sidebarItem.map((item, index) => {
            return (
              <SidebarItem icon={item.icon} key={index} item={item}></SidebarItem>
            );
          })}
        </ul>
      </div>

    </StyledNavbarContainer>
  );
};

export default Navbar;
