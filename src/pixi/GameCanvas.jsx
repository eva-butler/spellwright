import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const GameCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let app;

    const initPixi = async () => {
      app = await PIXI.Application.init({
        resizeTo: canvasRef.current,
        backgroundColor: 0x2c2c3a,
      });

      canvasRef.current.appendChild(app.canvas); // use .canvas instead of .view

      // TEMPORARY: Draw a placeholder tile
      const rune = new PIXI.Graphics();
      rune.beginFill(0xffffff);
      rune.drawRect(0, 0, 64, 64);
      rune.endFill();
      rune.x = 100;
      rune.y = 100;
      app.stage.addChild(rune);
    };

    initPixi();

    return () => {
      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default GameCanvas;
