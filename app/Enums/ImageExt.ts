export enum ImageExt {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
}

export const ALLOWED_IMAGE_EXTENSIONS = Object.values(ImageExt) as Array<ImageExt | string>
