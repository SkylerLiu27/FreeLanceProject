import { Thumbnail } from './thumbnail';

export class Video {
  videoId: string;
  youtubeVideoId: string;
  title: string;
  description: string;
  publishedDateTime: Date;
  tags: Array<string>;
  thumbNailJSON: string;
}

export class VideoData {
  videoId: string;
  youtubeVideoId: string;
  title: string;
  description: string;
  publishedDateTime: Date;
  tags: Array<string>;
  thumbNailJSON: {
    default?:string,
    medium?:string,
    high?:string
  };
  isFavorite:boolean;
  isWatchLater:boolean;
  isRecentlyWatched:boolean;
}
