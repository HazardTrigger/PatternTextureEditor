import React, { useEffect, useRef } from "react";
import "./Preview.css";

type Props = {
  width: number;
  height: number;
  textureCanvas: HTMLCanvasElement;
  brickImages: HTMLImageElement[];
  updatedTextureCanvas: number
};

const Preview: React.FC<Props> = (props) => {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width, height, textureCanvas, brickImages, updatedTextureCanvas } = props;

  const updatePreview = () => {
    const ctx = previewCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(textureCanvas, 0, 0);
  };

  useEffect(() => {
    updatePreview();
  }, [updatedTextureCanvas]);

  return (
    <div id="preview-container">
      <div className="preview-section">
        <div className="preview-label">纹理预览：</div>
        {
          <canvas
            ref={previewCanvasRef}
            id="texturePreview"
            width={width}
            height={height}
          ></canvas>
        }
      </div>
      <div className="preview-section">
        <div className="preview-label">原始图片：</div>
        <img
          id="originalImage"
          alt="Original brick"
          src={brickImages.length > 0 ? brickImages[0].src : undefined}
        />
      </div>
    </div>
  );
};

export default Preview;
