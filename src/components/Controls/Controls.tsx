import React, { useRef, useState } from "react";
import "./Controls.css";
import { ImageLoader } from "three";

type Props = {
  gapWidth: number;
  setGapWidth: React.Dispatch<React.SetStateAction<number>>;
  offsetX: number;
  setOffsetX: React.Dispatch<React.SetStateAction<number>>;
  offsetY: number;
  setOffsetY: React.Dispatch<React.SetStateAction<number>>;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  alternateRotation: boolean;
  setAlternateRotation: React.Dispatch<React.SetStateAction<boolean>>;
  globalOffsetX: number;
  setGlobalOffsetX: React.Dispatch<React.SetStateAction<number>>;
  globalOffsetY: number;
  setGlobalOffsetY: React.Dispatch<React.SetStateAction<number>>;
  globalRotation: number;
  setGlobalRotation: React.Dispatch<React.SetStateAction<number>>;
  setBrickImages: React.Dispatch<React.SetStateAction<HTMLImageElement[]>>;
  currentPattern: number;
  setCurrentPattern: React.Dispatch<React.SetStateAction<number>>;
  repeat: number;
  setRepeat: React.Dispatch<React.SetStateAction<number>>;
};

const Controls: React.FC<Props> = (props) => {
  const imageLoader = new ImageLoader();

  const {
    gapWidth,
    setGapWidth,
    offsetX,
    setOffsetX,
    offsetY,
    setOffsetY,
    rotation,
    setRotation,
    alternateRotation,
    setAlternateRotation,
    globalOffsetX,
    setGlobalOffsetX,
    globalOffsetY,
    setGlobalOffsetY,
    globalRotation,
    setGlobalRotation,
    setBrickImages,
    currentPattern,
    setCurrentPattern,
    repeat,
    setRepeat,
  } = props;

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const resetBrickTransform = () => {
    setGapWidth(0);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setAlternateRotation(false);
  };

  const resetGlobalTransform = () => {
    setGlobalOffsetX(0);
    setGlobalOffsetY(0);
    setGlobalRotation(0);
  };

  return (
    <div id="controls">
      <div className="control-group">
        <h3>模式选择</h3>
        <button
          className={`pattern-btn ${currentPattern === 0 ? 'active' : ''}`}
          data-pattern="running"
          onClick={() => {
            setCurrentPattern(0);
          }}
        >
          无缝模式
        </button>
        <button
          className={`pattern-btn ${currentPattern === 1 ? 'active' : ''}`}
          data-pattern="grid"
          onClick={() => {
            setCurrentPattern(1);
          }}
        >
          网格模式
        </button>
        <button
          className={`pattern-btn ${currentPattern === 2 ? 'active' : ''}`}
          data-pattern="running"
          onClick={() => {
            setCurrentPattern(2);
          }}
        >
          工字模式
        </button>
        <button
          className={`pattern-btn ${currentPattern === 3 ? 'active' : ''}`}
          data-pattern="third"
          onClick={() => {
            setCurrentPattern(3);
          }}
        >
          1/3偏移模式
        </button>
      </div>

      <div className="control-group">
        <h3>
          砖块变换{" "}
          <button className="reset-btn" onClick={resetBrickTransform}>
            重置
          </button>
        </h3>
        <div className="control-label">
          缝隙宽度{" "}
          <span className="value-display" id="gapValue">
            {gapWidth}px
          </span>
        </div>
        <input
          type="range"
          id="gapWidth"
          min="0"
          max="10"
          step="1"
          value={gapWidth}
          onChange={(e) => {
            setGapWidth(+e.target.value);
          }}
        />

        <div className="control-label">
          水平偏移{" "}
          <span className="value-display" id="offsetXValue">
            {offsetX}px
          </span>
        </div>
        <input
          type="range"
          id="offsetX"
          min="-100"
          max="100"
          value={offsetX}
          onChange={(e) => {
            setOffsetX(+e.target.value);
          }}
        />

        <div className="control-label">
          垂直偏移{" "}
          <span className="value-display" id="offsetYValue">
            {offsetY}px
          </span>
        </div>
        <input
          type="range"
          id="offsetY"
          min="-100"
          max="100"
          value={offsetY}
          onChange={(e) => {
            setOffsetY(+e.target.value);
          }}
        />

        <div className="control-label">
          旋转角度{" "}
          <span className="value-display" id="rotationValue">
            {rotation}°
          </span>
        </div>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => {
            setRotation(+e.target.value);
          }}
        />

        <div className="checkbox-control">
          <input
            type="checkbox"
            id="alternateRotation"
            checked={alternateRotation}
            onChange={(e) => {
              setAlternateRotation(e.target.checked);
            }}
          />
          <label htmlFor="alternateRotation">交替旋转</label>
        </div>
      </div>

      <div className="control-group">
        <h3>
          整体变换{" "}
          <button className="reset-btn" onClick={resetGlobalTransform}>
            重置
          </button>
        </h3>
        <div className="control-label">
          整体水平偏移{" "}
          <span className="value-display" id="globalOffsetXValue">
            {globalOffsetX}px
          </span>
        </div>
        <input
          type="range"
          id="globalOffsetX"
          min="-1000"
          max="1000"
          value={globalOffsetX}
          onChange={(e) => {
            setGlobalOffsetX(+e.target.value);
          }}
        />

        <div className="control-label">
          整体垂直偏移{" "}
          <span className="value-display" id="globalOffsetYValue">
            {globalOffsetY}px
          </span>
        </div>
        <input
          type="range"
          id="globalOffsetY"
          min="-1000"
          max="1000"
          value={globalOffsetY}
          onChange={(e) => {
            setGlobalOffsetY(+e.target.value);
          }}
        />

        <div className="control-label">
          整体旋转{" "}
          <span className="value-display" id="globalRotationValue">
            {globalRotation}°
          </span>
        </div>
        <input
          type="range"
          id="globalRotation"
          min="0"
          max="360"
          value={globalRotation}
          onChange={(e) => {
            setGlobalRotation(+e.target.value);
          }}
        />
      </div>

      <div className="control-group">
        <h3>纹理控制</h3>
        <div className="control-label">
          重复次数{" "}
          <span className="value-display" id="repeatValue">
            {repeat}
          </span>
        </div>
        <input
          type="range"
          id="textureRepeat"
          min="1"
          max="10"
          step="1"
          value={repeat}
          onChange={(e) => {
            setRepeat(+e.target.value);
          }}
        />

        <div className="separator"></div>

        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const url = URL.createObjectURL(e.target.files[0]);
              imageLoader.load(url, (image) => {
                setBrickImages([image]);
                setImageSize({ width: image.width, height: image.height });
              });
            }
          }}
        />
        <div id="info">
          {imageSize.width === 0 && imageSize.height === 0
            ? "图片尺寸: 等待上传..."
            : `${imageSize.width}X${imageSize.height}`}
        </div>
      </div>
    </div>
  );
};

export default Controls;
