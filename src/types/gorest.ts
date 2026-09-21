export type GorestGender = 'male' | 'female';
export type GorestStatus = 'active' | 'inactive';

export interface GorestUserCreateRequest {
  name: string;
  email: string;
  gender: GorestGender;
  status: GorestStatus;
}

export interface GorestUser extends GorestUserCreateRequest {
  id: number;
}

export type GorestUserUpdateRequest = Partial<GorestUserCreateRequest>;

export interface GorestPostCreateRequest {
  title: string;
  body: string;
}

export interface GorestPost extends GorestPostCreateRequest {
  id: number;
  user_id: number;
}

export interface GorestCommentCreateRequest {
  name: string;
  email: string;
  body: string;
}

export interface GorestComment extends GorestCommentCreateRequest {
  id: number;
  post_id: number;
}
