import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import HealingIcon from "@material-ui/icons/Healing";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "wouter";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    backgroundColor: "steelblue",
    marginLeft: 10,
  },
  title: {
    flexGrow: 1,
    marginLeft: 10,
  },
}));

const Navbar = () => {
  const classes = useStyles();


  return (
    <AppBar position="static">
      <Toolbar>
        <div className="hidden sm:flex">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <HealingIcon style={{ color: "#000000" }} />
          </IconButton>
          <div className="sm:mr-20 sm:text-xl self-center ">
            Vacunas del coronavirus aplicación
          </div>
        </div>
        <Link href="/">
          <Button className={classes.menuButton} color="inherit">
            Comparar evolución en países
          </Button>
        </Link>
        <Link href="/world-situation">
          <Button className={classes.menuButton} color="inherit">
            Situación mundial
          </Button>
        </Link>
        <Link href="/country/Uruguay">
          <Button className={classes.menuButton} color="inherit">
            Ver estadísticas en un país
          </Button>
        </Link>
        <Link href="/ranking">
          <Button className={classes.menuButton} color="inherit">
            Ranking de países
          </Button>
        </Link>
        <Link href="/all-rankings">
          <Button className={classes.menuButton} color="inherit">
            Todos los rankings
          </Button>
        </Link>
        <Link href="/information-source">
          <Button className={classes.menuButton} color="inherit">
            Fuentes
          </Button>
        </Link>


      </Toolbar>
    </AppBar >
  );
};

export default Navbar;
