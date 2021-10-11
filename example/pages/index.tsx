import { css } from "@emotion/css";
import React from "react";

const container = css`
  background: #000;
  color: #FFF;
`;

export default () => {
  return (
    <div className={container}>
      Hello World
    </div>
  );
};
