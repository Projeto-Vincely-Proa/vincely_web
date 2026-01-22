// Conteudo.js
import React, { useContext, useEffect } from "react";
 import Feed from  "../../components/feed/feed.jsx"
import StatsPanel from "../../components/staticMembers/staticMembers.jsx";
import "../Conteudo/conteudo.css";
import { PageTitleContext } from '../../contexts/PageTitleContext';

function Conteudo() {
  const { setPageTitle } = useContext(PageTitleContext);

  useEffect(() => {
    setPageTitle('Minhas Comunidades');
    return () => setPageTitle('Vincely');
  }, [setPageTitle]);
  return (
    <>
      <div className="content-area">
        <main className="layout">
          <Feed />
          <StatsPanel />
        </main>
      </div>
    </>

  );
}

export default Conteudo;
