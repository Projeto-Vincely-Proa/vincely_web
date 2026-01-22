import { useState } from "react";
import "./post.css";

import iconSettings from "../../icons/Newspaper.svg";
import iconEmojis from "../../icons/iconsPost/iconEmojis.svg";
import iconShare from "../../icons/iconsPost/Share.svg";
import iconAtt from "../../icons/iconsPost/Attach.svg";
import iconText from "../../icons/iconsPost/text.svg";
import iconGif from "../../icons/iconsPost/GIF.svg";
import iconCamera from "../../icons/iconsPost/iconvideocam.svg";
import iconImage from "../../icons/iconsPost/image.svg";

import PostHeader from "../post/PostHeader";
import PostActions from "../post/PostActions";
import PostMedia from "../post/PostMedia";

function Post() {
  const [text, setText] = useState("");

  // Handlers
  const handleEmojiClick = () => { console.log("Abrir seletor de emojis"); };
  const handleShareClick = () => { console.log("Compartilhar post"); };
  const handleAttachClick = () => { console.log("Adicionar arquivo"); };
  const handleTextClick = () => { console.log("Adicionar texto"); };
  const handleGifClick = () => { console.log("Adicionar GIF"); };
  const handleCameraClick = () => { console.log("Abrir câmera"); };
  const handleImageClick = () => { console.log("Adicionar imagem"); };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    console.log("Post enviado:", text);
    setText("");
  };

  const postButtons = [
    { icon: iconShare, label: "Compartilhar", onClick: handleShareClick },
    { icon: iconAtt, label: "Anexar arquivo", onClick: handleAttachClick },
    { icon: iconText, label: "Adicionar texto", onClick: handleTextClick },
    { icon: iconGif, label: "Adicionar GIF", onClick: handleGifClick },
    { icon: iconCamera, label: "Abrir câmera", onClick: handleCameraClick },
    { icon: iconImage, label: "Adicionar imagem", onClick: handleImageClick },
  ];

  return (
    <section className="post-section" aria-labelledby="post-title">

      <PostHeader title={"O que você quer compartilhar?"} settingsIcon={iconSettings} onSettings={() => console.log('Abrir configurações do post')} />

      <article className="post-card">
        <form className="post-form">
          <div className="textarea-wrapper">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="𝖤𝗎 𝗃á 𝖿𝗎𝗂 𝖽𝗈𝗆𝗂𝗇𝖺𝖽𝗈 𝗉𝖾𝗅𝖺 𝖺𝗇𝗌𝗂𝖾𝖽𝖺𝖽𝖾, 𝗆𝖺𝗌 𝖺𝗉𝗋𝖾𝗇𝖽𝗂 𝖺 𝗋𝖾𝗌𝗉𝗂𝗋𝖺𝗋, 𝖺 𝗆𝖾 𝗈𝗎𝗏𝗂𝗋 𝖾 𝖺 𝗌𝖾𝗀𝗎𝗂𝗋 𝗇𝗈 𝗆𝖾𝗎 𝗋𝗂𝗍𝗆𝗈. 𝖧𝗈𝗃𝖾, 𝗈𝗅𝗁𝗈 𝗉𝖺𝗋𝖺 𝗆𝗂𝗆 𝖼𝗈𝗆 𝗈𝗋𝗀𝗎𝗅𝗁𝗈 𝗉𝗈𝗋 𝗇ã𝗈 𝗍𝖾𝗋 𝖽𝖾𝗌𝗂𝗌𝗍𝗂𝖽𝗈 𝖽𝖾 𝗆𝗂𝗆 𝗆𝖾𝗌𝗆𝗈."
            />

            {text === "" && (
              <button type="button" className="emoji-button" onClick={handleEmojiClick} aria-label="Adicionar emoji">
                <img src={iconEmojis} alt="Emoji" />
              </button>
            )}

            <PostMedia />

            <div className="post-divider"></div>

            <PostActions buttons={postButtons} onSubmit={handlePostSubmit} />
          </div>
        </form>
      </article>
    </section>
  );
}

export default Post;
