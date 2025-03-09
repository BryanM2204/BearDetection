import "./main.css";
import Bear from "./resources/beartest1.jpg";
import Image, {StaticImageData} from "next/image";

export default function Login() {
  return (
      <div className="main">
        <div className="title">
          <span>Bear Detections</span>
        </div>
        <div className="mainImage">
          <img className="bigImg" src={Bear.src} alt="hello"></img>
        </div>
        <div className="detections">
          <img src={Bear.src} alt="hello"></img>
          <img src={Bear.src} alt="hello"></img>
          <img src={Bear.src} alt="hello"></img>
          <img src={Bear.src} alt="hello"></img>
          <img src={Bear.src} alt="hello"></img>
          <img src={Bear.src} alt="hello"></img>
        </div>
      </div>

  );
}