export enum SocialNetwork {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  TikTok = 'TikTok',
  YouTube = 'YouTube',
}

export interface Statistics {
  TikTok: SocialNetworkStatistics;
  localId: string;
  lastUpdated: string;
  YouTube: SocialNetworkStatistics;
  Instagram: SocialNetworkStatistics;
  Facebook: SocialNetworkStatistics;
}

export interface SocialNetworkStatistics {
  statistics: {
    comments: number;
    followers: number;
    likes: number;
    views: number;
  };
  followersGrowth: any;
}
