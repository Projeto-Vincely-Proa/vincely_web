import "./feed.css";
import Post from "../cardpost/post.jsx";



import User01 from "../../img/profile/user01.png";
import ImgPost from "../../img/post-img.svg";


import IconEstatistic from "../../icons/iconsPost/bar-graph.svg";
import IconComent from "../../icons/iconsPost/chat.svg";
import IconEmoji from "../../icons/iconsPost/happycoment.svg";
import IconSave from "../../icons/iconsPost/Save.svg";

import HeartIcon from "../../icons/iconsPost/HeartIcon.svg"
import ComentIcon from "../../icons/iconsPost/comment_qtd.svg"
import Compart from "../../icons/iconsPost/next-sheart.svg"


function Feed() {
  return (
    <main className="layout-feed">

      {/* Coluna central com Feed */}
      <div className="feed-column">
        <Post />

        <div className="feed-posts">
          <section className="posts">
            <div className="profile-post">
              <img src={User01} alt="Avatar Usuario" />
              <div className="profile-info">
                <h4>Alvaro Carvalho • </h4>
                <p>@alv1234</p>
              </div>

              <div className="temp-post">
                <p><span>17 </span>minutes ago</p>
              </div>
            </div>

            <div className="post-conteudo">
              <img src={ImgPost} alt="Imagem do post" />

              <p>
                Eu já passei por dias em que tudo parecia sem cor,
                 mas aprendi a me cuidar, a pedir apoio e a reconhecer meu próprio valor. Hoje,
                  mesmo que nem todos os dias sejam fáceis, eu sei que não estou mais no mesmo lugar de antes.
              </p>
            </div>

            <div className="icons-reac">
              <div className="react">
                <button>
                  <img src={HeartIcon} alt="" />
                </button>
                  <button>
                  <img src={ComentIcon} alt="" />
                </button>
                  <button>
                  <img src={Compart} alt="" />
                </button>
              </div>
              <div className="interact">
                <button>
                  <img src={IconEstatistic} alt="" />
                </button>
                 <button>
                  <img src={IconComent} alt="" />
                </button>
                 <button>
                  <img src={IconEmoji} alt="" />
                </button>
                 <button>
                  <img src={IconSave} alt="" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="feed-posts">
          <section className="posts">
            <div className="profile-post">
              <img src={User01} alt="Avatar Usuario" />
              <div className="profile-info">
                <h4>Alvaro Carvalho • </h4>
                <p>@alv1234</p>
              </div>

              <div className="temp-post">
                <p><span>17 </span>minutes ago</p>
              </div>
            </div>

            <div className="post-conteudo">
              <img src={ImgPost} alt="Imagem do post" />

              <p>
                Eu já passei por dias em que tudo parecia sem cor,
                 mas aprendi a me cuidar, a pedir apoio e a reconhecer meu próprio valor. Hoje,
                  mesmo que nem todos os dias sejam fáceis, eu sei que não estou mais no mesmo lugar de antes.
              </p>
            </div>

            <div className="icons-reac">
              <div className="react">
                <button>
                  <img src={HeartIcon} alt="" />
                </button>
                  <button>
                  <img src={ComentIcon} alt="" />
                </button>
                  <button>
                  <img src={Compart} alt="" />
                </button>
              </div>
              <div className="interact">
                <button>
                  <img src={IconEstatistic} alt="" />
                </button>
                 <button>
                  <img src={IconComent} alt="" />
                </button>
                 <button>
                  <img src={IconEmoji} alt="" />
                </button>
                 <button>
                  <img src={IconSave} alt="" />
                </button>
              </div>
            </div>
          </section>
        </div>
      


    </main>
  );
}

export default Feed;
