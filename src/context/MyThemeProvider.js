import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { backgroundColor } from '../theme';

const ThemeToggleContext = React.createContext({});

const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Inter, sans-serif;
    background-color: ${backgroundColor}
  }

  p {
    color: #A8A8A8;
    font-family: Inter, sans-serif;
  }
`

export const useTheme = () => React.useContext(ThemeToggleContext);

export default function MyThemeProvider({ children }) {

  const [themeState, setThemeState] = React.useState({
    mode: 'light'
  });

  const toggle = () => {
    const mode = (themeState.mode === 'light' ? `dark` : `light`);
    setThemeState({ mode: mode });
  };

  return (
    <ThemeToggleContext.Provider value={{ toggle: toggle }}>
      <ThemeProvider
        theme={{
          mode: themeState.mode
        }}
      >
        <>
          <GlobalStyle/>
          {children}
        </>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
