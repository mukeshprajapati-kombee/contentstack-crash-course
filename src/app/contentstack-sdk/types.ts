/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  url: string;
  title: string;
  $?: any;
}

export interface Block {
  _metadata: {
    uid: string;
  };
  $?: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: "image_left" | "image_right" | null;
}

export interface Blocks {
  block: Block;
}

export interface Page {
  uid: string;
  $?: any;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
}
