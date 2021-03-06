import { Maybe } from "../../types";
import { createBitmapImage, cropCenterImageDataWithResampling } from "./utils";
import { Filter } from "./filter";

const [snapshotWidth, snapshotHeight] = [128, 100].map(i =>
  Math.round(i * 0.7)
);

let snapshotOriginalImageData: Maybe<Uint8ClampedArray> = null;

export function initSnapshotOriginalData(imageData: ImageData) {
  snapshotOriginalImageData = cropCenterImageDataWithResampling(
    imageData,
    snapshotWidth,
    snapshotHeight
  );
}

export function generateFilterSnapshot(filter: Filter): Promise<Blob> {
  const snapshotCanvas = new OffscreenCanvas(snapshotWidth, snapshotHeight);
  const snapshotCtx = snapshotCanvas.getContext("2d");

  const image = createBitmapImage(
    snapshotWidth,
    snapshotHeight,
    snapshotOriginalImageData!
  );
  image.apply_lut(filter);

  snapshotCtx!.putImageData(
    new ImageData(
      Uint8ClampedArray.from(image.get_current_data_array()),
      snapshotWidth,
      snapshotHeight
    ),
    0,
    0
  );
  return snapshotCanvas.convertToBlob();
}
