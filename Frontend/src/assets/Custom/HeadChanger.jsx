import React from "react";
import { Helmet } from "react-helmet-async";

const HeadChanger = ({ title = "" }) => {
  const fullTitle = title ? `${title} | Bislary` : "Bislary";

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default HeadChanger;
