import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy, IProfile } from 'passport-azure-ad';
import ukmaAuthConfig from '@libs/configs/strategy';

@Injectable()
export class UkmaStrategy extends PassportStrategy(
  OIDCStrategy,
  'UkmaStrategy',
) {
  constructor() {
    super({ ...ukmaAuthConfig });
  }

  public async validate(profile: IProfile): Promise<IProfile> {
    if (!profile?.oid) {
      throw new UnauthorizedException('No OID found!');
    }

    return profile;
  }
}
