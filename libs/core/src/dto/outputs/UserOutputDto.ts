import { User } from '@libs/core/database/entities';
import { Role } from '@libs/core/database/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UserOutputDto {
  constructor(user?: User) {
    this.id = user.id;
    this.sourceId = user.sourceId;
    this.email = user.email;
    this.username = user.username;
    this.roles = user.roles;
  }

  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public sourceId: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public username?: string;

  @ApiProperty()
  public roles: Role[];
}
