export type User = {
  id: string;
  name: string;
  balance: number;
  profile?: Profile;
  posts?: Post[];
};

export type Profile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: 'basic' | 'business';
  memberType?: MemberType;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type MemberType = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
};
