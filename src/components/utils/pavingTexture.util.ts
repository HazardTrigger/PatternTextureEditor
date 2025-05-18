import {
  Camera,
  CanvasTexture,
  OrthographicCamera,
  PerspectiveCamera,
  RepeatWrapping,
  Vector2,
} from "three";
import { DEG2RAD } from "three/src/math/MathUtils.js";

export namespace PavingTextureUtil {
  export type PatternTextureOption = {
    brickImage: HTMLImageElement[];
    localOffsetX: number;
    localOffsetY: number;
    localRotation: number;
    globalOffsetX: number;
    globalOffsetY: number;
    globalRotation: number;
    alternateRotation: boolean;
    gapWidth: number;
    pattern: number;
    uvCenter?: Vector2;
  };

  export const createTextureCanvas = (option?: {
    width?: number;
    height?: number;
  }) => {
    const canvas = document.createElement("canvas");
    canvas.width = option?.width ?? 256;
    canvas.height = option?.height ?? 256;
    return canvas;
  };

  const updateTextureSetting = (
    canvasTexture: CanvasTexture,
    option: {
      repeat: Vector2;
      globalOffsetX: number;
      globalOffsetY: number;
      globalRotation: number;
      uvCenter?: Vector2;
    }
  ) => {
    const { repeat, globalOffsetX, globalOffsetY, globalRotation, uvCenter } =
      option;

    canvasTexture.wrapS = RepeatWrapping;
    canvasTexture.wrapT = RepeatWrapping;
    canvasTexture.repeat.copy(repeat);
    canvasTexture.offset.set(globalOffsetX / 1000, globalOffsetY / 1000);
    canvasTexture.rotation = globalRotation * DEG2RAD;
    canvasTexture.center.copy(uvCenter ?? new Vector2(0, 0));
    canvasTexture.generateMipmaps = true;
    canvasTexture.needsUpdate = true;
  };

  const calculateBrickSize = (
    canvasWidth: number,
    canvasHeight: number,
    imageAspectRatio: number,
    rows: number,
    cols: number
  ) => {
    let brickWidth: number;
    let brickHeight: number;

    if (imageAspectRatio >= 1) {
      brickHeight = canvasHeight / rows;
      brickWidth = brickHeight * imageAspectRatio;
    } else {
      brickWidth = canvasWidth / cols;
      brickHeight = brickWidth / imageAspectRatio;
    }

    return { width: brickWidth, height: brickHeight };
  };

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
  };

  const drawBrick = (
    brickImages: HTMLImageElement[],
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    option: {
      localOffsetX: number;
      localOffsetY: number;
      localRotation: number;
      gapWidth: number;
    }
  ) => {
    let {
      localOffsetX = 0,
      localOffsetY = 0,
      localRotation = 0,
      gapWidth = 0,
    } = option;

    gapWidth /= 2;

    const brickImage = brickImages[getRandomInt(0, brickImages.length)];

    ctx.save();

    // 翻转坐标系，使原点位于左下角
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);

    // 应用间隙和移动到砖块位置
    ctx.translate(x + gapWidth, y + gapWidth);

    // 创建剪切区域
    ctx.beginPath();
    ctx.rect(0, 0, width - gapWidth, height - gapWidth);
    ctx.clip();

    // 移动到砖块中心进行旋转
    ctx.translate(width / 2, height / 2);
    ctx.rotate(localRotation * DEG2RAD);
    ctx.translate(-width / 2, -height / 2);

    // 应用本地偏移
    const drawX = localOffsetX % width;
    const drawY = localOffsetY % height;
    ctx.translate(drawX, drawY);

    // 主要图案
    ctx.drawImage(brickImage, 0, 0, width, height);

    // 边界重复绘制
    ctx.drawImage(brickImage, -width, 0, width, height);
    ctx.drawImage(brickImage, width, 0, width, height);
    ctx.drawImage(brickImage, 0, -height, width, height);
    ctx.drawImage(brickImage, 0, height, width, height);

    // 角落重复绘制
    ctx.drawImage(brickImage, -width, -height, width, height);
    ctx.drawImage(brickImage, width, -height, width, height);
    ctx.drawImage(brickImage, -width, height, width, height);
    ctx.drawImage(brickImage, width, height, width, height);

    ctx.restore();
  };

  const drawContinueRepeat = (
    brickImage: HTMLImageElement[],
    ctx: CanvasRenderingContext2D,
    options: {
      localOffsetX: number;
      localOffsetY: number;
      localRotation: number;
      alternateRotation: boolean;
      gapWidth: number;
      imageAspectRatio: number;
    }
  ) => {
    const {
      imageAspectRatio,
      localRotation,
      gapWidth,
      localOffsetX,
      localOffsetY,
      alternateRotation,
    } = options;

    const brickSize = calculateBrickSize(
      ctx.canvas.width,
      ctx.canvas.height,
      imageAspectRatio,
      2,
      2
    );

    for (
      let row = 0;
      row <= Math.ceil(ctx.canvas.height / brickSize.height);
      row++
    ) {
      for (
        let col = 0;
        col <= Math.ceil(ctx.canvas.width / brickSize.width);
        col++
      ) {
        const rotation = alternateRotation
          ? localRotation * ((row + col) % 2 ? -1 : 1)
          : localRotation;

        drawBrick(
          brickImage,
          ctx,
          col * brickSize.width,
          row * brickSize.height,
          brickSize.width,
          brickSize.height,
          {
            localOffsetX,
            localOffsetY,
            gapWidth,
            localRotation: rotation,
          }
        );
      }
    }
  };

  const drawCrossRepeat = (
    brickImage: HTMLImageElement[],
    ctx: CanvasRenderingContext2D,
    options: {
      localOffsetX: number;
      localOffsetY: number;
      localRotation: number;
      alternateRotation: boolean;
      gapWidth: number;
      imageAspectRatio: number;
    }
  ) => {
    const {
      localOffsetX,
      localOffsetY,
      localRotation,
      alternateRotation,
      gapWidth,
      imageAspectRatio,
    } = options;

    const brickSize = calculateBrickSize(
      ctx.canvas.width,
      ctx.canvas.height,
      imageAspectRatio,
      2,
      2
    );

    for (
      let row = 0;
      row <= Math.ceil(ctx.canvas.height / brickSize.height);
      row++
    ) {
      const rowRotation = alternateRotation
        ? localRotation * (row % 2 ? -1 : 1)
        : localRotation;

      const offsetX = ((row % 2) * brickSize.width) / 2;

      for (
        let col = -1;
        col <= Math.ceil(ctx.canvas.width / brickSize.width);
        col++
      ) {
        drawBrick(
          brickImage,
          ctx,
          col * brickSize.width + offsetX,
          row * brickSize.height,
          brickSize.width,
          brickSize.height,
          {
            localOffsetX,
            localOffsetY,
            gapWidth,
            localRotation: rowRotation,
          }
        );
      }
    }
  };

  const drawThreeSixNineRepeat = (
    brickImage: HTMLImageElement[],
    ctx: CanvasRenderingContext2D,
    options: {
      localOffsetX: number;
      localOffsetY: number;
      localRotation: number;
      alternateRotation: boolean;
      gapWidth: number;
      imageAspectRatio: number;
    }
  ) => {
    const {
      localOffsetX,
      localOffsetY,
      localRotation,
      alternateRotation,
      gapWidth,
      imageAspectRatio,
    } = options;

    const brickSize = calculateBrickSize(
      ctx.canvas.width,
      ctx.canvas.height,
      imageAspectRatio,
      3,
      3
    );

    for (
      let row = 0;
      row <= Math.ceil(ctx.canvas.height / brickSize.height);
      row++
    ) {
      const rowRotation = alternateRotation
        ? localRotation * (row % 2 ? -1 : 1)
        : localRotation;

      const offsetX = ((row * brickSize.width) / 3) % brickSize.width;

      for (
        let col = -1;
        col <= Math.ceil(ctx.canvas.width / brickSize.width);
        col++
      ) {
        drawBrick(
          brickImage,
          ctx,
          col * brickSize.width + offsetX,
          row * brickSize.height,
          brickSize.width,
          brickSize.height,
          {
            localOffsetX,
            localOffsetY,
            gapWidth,
            localRotation: rowRotation,
          }
        );
      }
    }
  };

  export const pixelToWorldUnit = (
    pixelLength: number,
    camera: Camera,
    rendererSize: Vector2
  ) => {
    let worldUnitLength;

    if (camera instanceof OrthographicCamera) {
      // 对于正交相机
      const cameraWidth = camera.right - camera.left;
      const cameraHeight = camera.top - camera.bottom;
      const pixelsPerUnit = Math.min(
        rendererSize.width / cameraWidth,
        rendererSize.height / cameraHeight
      );
      worldUnitLength = pixelLength / pixelsPerUnit;
    } else if (camera instanceof PerspectiveCamera) {
      // 对于透视相机
      const vFOV = (camera.fov * Math.PI) / 180; // 垂直视场角
      const height = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
      const pixelsPerUnit = rendererSize.height / height;
      worldUnitLength = pixelLength / pixelsPerUnit;
    } else {
      throw new Error("Unsupported camera type");
    }

    return worldUnitLength;
  };

  export const worldUnitToPixel = (
    worldUnitLength: number,
    camera: Camera,
    rendererSize: Vector2
  ) => {
    let pixelLength;

    if (camera instanceof OrthographicCamera) {
      // 对于正交相机
      const cameraWidth = camera.right - camera.left;
      const cameraHeight = camera.top - camera.bottom;
      const pixelsPerUnit = Math.min(
        rendererSize.width / cameraWidth,
        rendererSize.height / cameraHeight
      );
      pixelLength = worldUnitLength * pixelsPerUnit;
    } else if (camera instanceof PerspectiveCamera) {
      // 对于透视相机
      const vFOV = (camera.fov * Math.PI) / 180; // 垂直视场角
      const height = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
      const pixelsPerUnit = rendererSize.height / height;
      pixelLength = worldUnitLength * pixelsPerUnit;
    } else {
      throw new Error("Unsupported camera type");
    }

    return pixelLength;
  };

  export const updateTexture = (
    texture: CanvasTexture,
    textureCanvas: HTMLCanvasElement,
    camera: Camera,
    rendererSize: Vector2,
    option: PatternTextureOption
  ) => {
    const {
      localOffsetX,
      localOffsetY,
      localRotation,
      globalOffsetX,
      globalOffsetY,
      globalRotation,
      alternateRotation,
      gapWidth,
      pattern,
      brickImage,
      uvCenter,
    } = option;

    const imageAspectRatio =
      brickImage.length > 0 ? brickImage[0].width / brickImage[0].height : 2;

    const maxSize = Math.max(textureCanvas.width, textureCanvas.height);
    if (imageAspectRatio > 1) {
      textureCanvas.width = maxSize;
      textureCanvas.height = Math.round(maxSize / imageAspectRatio);
    } else {
      textureCanvas.height = maxSize;
      textureCanvas.width = Math.round(maxSize * imageAspectRatio);
    }

    const repeat = new Vector2(
      Math.ceil(
        worldUnitToPixel(10, camera, rendererSize) / textureCanvas.width
      ),
      Math.ceil(
        worldUnitToPixel(10, camera, rendererSize) / textureCanvas.height
      )
    );

    const ctx = textureCanvas.getContext("2d")!;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    switch (pattern) {
      case 0:
      case 1:
        drawContinueRepeat(brickImage, ctx, {
          localOffsetX,
          localOffsetY,
          localRotation,
          alternateRotation,
          gapWidth,
          imageAspectRatio,
        });
        break;
      case 2:
        drawCrossRepeat(brickImage, ctx, {
          localOffsetX,
          localOffsetY,
          localRotation,
          alternateRotation,
          gapWidth,
          imageAspectRatio,
        });
        break;
      case 3:
        drawThreeSixNineRepeat(brickImage, ctx, {
          localOffsetX,
          localOffsetY,
          localRotation,
          alternateRotation,
          gapWidth,
          imageAspectRatio,
        });
        break;
      default:
        break;
    }

    updateTextureSetting(texture, {
      repeat,
      globalOffsetX,
      globalOffsetY,
      globalRotation,
      uvCenter,
    });
  };
}
