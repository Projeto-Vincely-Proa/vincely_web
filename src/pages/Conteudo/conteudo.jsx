// Conteudo.js
import React from "react";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
 import Feed from  "../../components/feed/feed.jsx"
import StatsPanel from "../../components/staticMembers/staticMembers.jsx";
import "../Conteudo/conteudo.css";

function Conteudo() {
  return (
    <>
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <main className="layout">
          <Feed />
          <StatsPanel />
        </main>
      </div>
    </>

  );
}

export default Conteudo;
