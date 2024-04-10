import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedUserRoles1679308850052 implements MigrationInterface {
    name = 'UpdatedUserRoles1679308850052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
    }

}
