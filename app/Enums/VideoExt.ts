export enum VideoExt {
  MP4 = 'mp4',
}

export const ALLOWED_VIDEO_EXTENSIONS = Object.values(VideoExt) as Array<VideoExt | string>
