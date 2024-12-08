import { BaseEntity } from '../entity';

export class BaseModel {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

  constructor(params: BaseModelParams) {
    const { id, createdAt, updatedAt, deletedAt } = params;

    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toEntity(): BaseEntity {
    return {
      id: this.id,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromEntity(obj: BaseEntity): BaseModel {
    return new BaseModel({
      id: obj.id,
      createdAt: obj.created_at,
      updatedAt: obj.updated_at,
      deletedAt: obj.deleted_at,
    });
  }
}

export interface BaseModelParams {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
