import React from "react";
import { Link } from "wouter";
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
`


const Navbar = () => {

  return (
    <StyledNavbarContainer>
      <div className="logo-container">
        <img src="/logo.png" />
      </div>
      <div className="link">
        <Link href="/">
          <Button className={classes.menuButton} color="inherit">
            Comparar evolución en países
          </Button>
        </Link>
      </div>
      <div className="link">
        <Link href="/world-situation">
          <PublicIcon />
          Situación mundial
        </Link>
      </div>
      <div className="link">
        <Link href="/country/Uruguay">
          <Button className={classes.menuButton} color="inherit">
            Ver estadísticas en un país
          </Button>
        </Link>
      </div>
      <div className="link">
        <Link href="/ranking">
          <Button className={classes.menuButton} color="inherit">
            Ranking de países
          </Button>
        </Link>
      </div>
      <div className="link">
        <Link href="/all-rankings">
          <DonutSmallIcon />
          Todos los rankings
        </Link>
      </div>
      <div className="link">
        <Link href="/information-source">
          <DescriptionIcon />
          Fuentes
        </Link>
      </div>
    </StyledNavbarContainer>
  );
};

export default Navbar;
