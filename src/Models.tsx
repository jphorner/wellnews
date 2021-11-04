export interface CleanedArticle {
  section: string
  title: string
  abstract: string
  short_url: string
  multimedia: Multimedia
  sentiment: number
};

export interface Multimedia {
  url: string
  format: string
  height: number
  width: number
  type: string
  subtype: string
  caption: string
  copyright: string
};