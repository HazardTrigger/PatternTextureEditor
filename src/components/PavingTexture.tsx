import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PavingTexture.css";
import Controls from "./Controls/Controls";
import {
  AxesHelper,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import Preview from "./Preview/Preview";
import { PavingTextureUtil } from "./utils/pavingTexture.util";
import { OrbitControls } from "three/examples/jsm/Addons.js";

type Props = {};

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const PavingTexture: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [textureWidth, setTextureWidth] = useState(512);
  const [textureHeight, setTextureHeight] = useState(512);
  const [brickImages, setBrickImages] = useState<HTMLImageElement[]>([]);
  const [textureCanvas, setTextureCanvas] = useState(
    PavingTextureUtil.createTextureCanvas({
      width: textureWidth,
      height: textureHeight,
    })
  );
  const [texture, setTexture] = useState(new CanvasTexture(textureCanvas));

  const [currentPattern, setCurrentPattern] = useState(1);
  const [gapWidth, setGapWidth] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [alternateRotation, setAlternateRotation] = useState(false);
  const [globalOffsetX, setGlobalOffsetX] = useState(0);
  const [globalOffsetY, setGlobalOffsetY] = useState(0);
  const [globalRotation, setGlobalRotation] = useState(0);
  const [updatedTextureCanvas, setUpdatedTextureCanvas] = useState(
    performance.now()
  );

  const updateTextureOption =
    useMemo<PavingTextureUtil.PatternTextureOption>(() => {
      return {
        brickImage: brickImages,
        localOffsetX: offsetX,
        localOffsetY: offsetY,
        localRotation: rotation,
        globalOffsetX,
        globalOffsetY,
        globalRotation,
        alternateRotation,
        gapWidth: currentPattern !== 0 ? gapWidth : 0,
        pattern: currentPattern,
        worldHeight: 10,
        worldWidth: 10,
      };
    }, [
      brickImages,
      offsetX,
      offsetY,
      rotation,
      globalOffsetX,
      globalOffsetY,
      rotation,
      globalOffsetX,
      globalOffsetY,
      globalRotation,
      alternateRotation,
      gapWidth,
      currentPattern,
    ]);

  const initScene = (canvas: HTMLCanvasElement) => {
    const scene = new Scene();
    scene.background = new Color(0xcccccc);
    scene.add(new AxesHelper(10));

    camera.position.z = 10;

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const planeGeometry = new PlaneGeometry(10, 10);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });
    const plane = new Mesh(planeGeometry, material);
    scene.add(plane);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    const dispose = () => {
      renderer.dispose();
      window.removeEventListener("resize", resize);
    };

    return { dispose };
  };

  const updateTextureCanvas = () => {
    if (brickImages.length === 0) return;

    PavingTextureUtil.updateTexture(
      texture,
      textureCanvas,
      camera,
      new Vector2(window.innerWidth, window.innerHeight),
      updateTextureOption
    );

    setUpdatedTextureCanvas(performance.now());
  };

  useEffect(() => {
    const { dispose } = initScene(canvasRef.current!);
    return () => {
      dispose();
    };
  }, []);

  useEffect(() => {
    updateTextureCanvas();
  }, [updateTextureOption]);

  return (
    <div id="container">
      <Controls
        gapWidth={gapWidth}
        setGapWidth={setGapWidth}
        offsetX={offsetX}
        setOffsetX={setOffsetX}
        offsetY={offsetY}
        setOffsetY={setOffsetY}
        rotation={rotation}
        setRotation={setRotation}
        alternateRotation={alternateRotation}
        setAlternateRotation={setAlternateRotation}
        globalOffsetX={globalOffsetX}
        setGlobalOffsetX={setGlobalOffsetX}
        globalOffsetY={globalOffsetY}
        setGlobalOffsetY={setGlobalOffsetY}
        globalRotation={globalRotation}
        setGlobalRotation={setGlobalRotation}
        setBrickImages={setBrickImages}
        currentPattern={currentPattern}
        setCurrentPattern={setCurrentPattern}
      />
      <Preview
        textureCanvas={textureCanvas}
        brickImages={brickImages}
        updatedTextureCanvas={updatedTextureCanvas}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default PavingTexture;
