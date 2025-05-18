import { CanvasTexture, RepeatWrapping, Vector2 } from "three";
import { DEG2RAD } from "three/src/math/MathUtils.js";

export namespace PavingTextureUtil {
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
    const {
      localOffsetX = 0,
      localOffsetY = 0,
      localRotation = 0,
      gapWidth = 0,
    } = option;

    const brickImage = brickImages[getRandomInt(0, brickImages.length)];

    ctx.save();

    // 修改：调整剪切区域，确保从左下角开始
    ctx.beginPath();
    ctx.rect(
      x + gapWidth,
      ctx.canvas.height - (y + height) + gapWidth,
      width - gapWidth * 2,
      height - gapWidth * 2
    );
    ctx.clip();

    // 修改：调整转换坐标以适应左下角原点
    const centerX = x + width / 2;
    const centerY = ctx.canvas.height - (y + height / 2);
    ctx.translate(centerX, centerY);
    ctx.rotate(localRotation * DEG2RAD);

    // 修改：调整绘制位置计算
    const drawX = -width / 2 + (localOffsetX % width);
    const drawY = -height / 2 + (localOffsetY % height);

    // 主要图案
    if (brickImages.length > 0) {
      ctx.drawImage(brickImage, drawX, drawY, width, height);
    } else {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(drawX, drawY, width, height);
    }

    // 边界重复绘制
    ctx.drawImage(brickImage, drawX - width, drawY, width, height);
    ctx.drawImage(brickImage, drawX + width, drawY, width, height);
    ctx.drawImage(brickImage, drawX, drawY - height, width, height);
    ctx.drawImage(brickImage, drawX, drawY + height, width, height);

    // 角落重复绘制
    ctx.drawImage(brickImage, drawX - width, drawY - height, width, height);
    ctx.drawImage(brickImage, drawX + width, drawY - height, width, height);
    ctx.drawImage(brickImage, drawX - width, drawY + height, width, height);
    ctx.drawImage(brickImage, drawX + width, drawY + height, width, height);

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

    for (let row = 0; row <= 3; row++) {
      for (let col = -1; col <= 2; col++) {
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
      4,
      2
    );

    for (let row = 0; row <= 5; row++) {
      const rowRotation = alternateRotation
        ? localRotation * (row % 2 ? -1 : 1)
        : localRotation;

      const offsetX = ((row % 2) * brickSize.width) / 2;

      for (let col = -1; col <= 2; col++) {
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
      2
    );

    for (let row = 0; row <= 3; row++) {
      const rowRotation = alternateRotation
        ? localRotation * (row % 2 ? -1 : 1)
        : localRotation;

      const offsetX = ((row * brickSize.width) / 3) % brickSize.width;

      for (let col = -1; col <= 2; col++) {
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

  export const updateTexture = (
    texture: CanvasTexture,
    textureCanvas: HTMLCanvasElement,
    option: {
      brickImage: HTMLImageElement[];
      repeat: Vector2;
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
    }
  ) => {
    const {
      repeat,
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
