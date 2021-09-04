import React from "react";
import LOGO from "../../assets/img/coronavirus.png";
import DescriptionIcon from "@material-ui/icons/Description";
import PublicIcon from "@material-ui/icons/Public";
import AppsIcon from "@material-ui/icons/Apps";
import BarChartIcon from "@material-ui/icons/BarChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import { useLocation } from "wouter";
import { Link } from "wouter";

const SideBar = () => {
  const [location, setLocation] = useLocation();

  console.log(location);

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
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={LOGO}></img>
        <h1>CORONAVIRUS</h1>
        <h4>VACUNAS</h4>
      </div>

      <ul className="sidebar__list">
        {sidebarItem.map((item, index) => {
          return (
            <SidebarItem icon={item.icon} key={index} item={item}></SidebarItem>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
