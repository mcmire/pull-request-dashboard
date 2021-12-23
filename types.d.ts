declare module '*.svg' {
  import React from 'react';

  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module 'tailwindcss/colors' {
  type HexColor = `#${string}`;
  type ColorGroup = {
    100: HexColor;
    200: HexColor;
    300: HexColor;
    400: HexColor;
    500: HexColor;
    600: HexColor;
    700: HexColor;
    800: HexColor;
    900: HexColor;
  };

  const colors: {
    neutral: ColorGroup;
    orange: ColorGroup;
    red: ColorGroup;
  };

  export default colors;
}
