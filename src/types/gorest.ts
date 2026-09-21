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
