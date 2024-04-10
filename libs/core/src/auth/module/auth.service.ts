import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IProfile } from 'passport-azure-ad';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseStudent, User, Admin } from '@libs/core/database/entities';
import { Repository } from 'typeorm';
import { Role } from '@libs/core/database/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'main') private userRepository: Repository<User>,
    @InjectRepository(BaseStudent, 'main')
    private studentRepository: Repository<BaseStudent>,
    @InjectRepository(Admin, 'main') private adminRepository: Repository<Admin>,
  ) {}

  public async processAzureProfile(profile: IProfile): Promise<User> {
    if (!profile?.oid) {
      throw new UnauthorizedException('No OID found!');
    } else {
      console.debug(`The OID is ${profile.oid}`);
      console.debug(`The email is ${profile._json.email}`);
      console.debug(
        `The preferred_username is ${profile._json.preferred_username}`,
      );

      const email: string =
        profile?._json?.email ?? profile?._json?.preferred_username;
      const username: string = profile?._json?.name ?? 'No name';

      const existing: User = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      const isAdmin = await this.checkAdmin(email);

      const auth: User =
        existing ??
        this.userRepository.create({
          sourceId: profile.oid,
          email,
          username,
          roles: isAdmin ? [Role.User, Role.Admin] : [Role.User],
        });

      await this.userRepository.save(auth).catch(() => {
        throw new InternalServerErrorException(
          'Помилка при збереженні облікового запису!',
        );
      });

      return auth;
    }
  }

  public async checkAdmin(email: string): Promise<boolean> {
    const student = await this.studentRepository.findOne({
      where: { ukma_email: email },
    });

    if (!student) {
      throw new InternalServerErrorException('No such user in database!');
    }

    const admin = await this.adminRepository.findOne({
      where: {
        student: {
          cdoc: student.cdoc,
        },
      },
    });

    if (!admin) {
      return false;
    }

    return true;
  }
}
