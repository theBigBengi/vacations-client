import React from "react";
import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: string;
  composition?: string;
  [key: string]: any;
}

const sources: any = {
  colors: "/oasis-logo-text-right-colors.png",
  white: "/oasis-logo-text-right.png",
  "white-bottom": "/oasis-logo-text-bottom.png",
  "colors-bottom": "/oasis-logo-text-bottom-colors.png",
};

const Logo: React.FC<LogoProps> = ({ size, composition, ...rest }) => {
  return (
    <Link to='/'>
      <img
        src={composition ? sources[composition] : sources["colors-bottom"]}
        alt='oasis_logo'
        className={styles.logo}
        style={{ height: size }}
        {...rest}
      />
    </Link>
  );
};

export default Logo;
