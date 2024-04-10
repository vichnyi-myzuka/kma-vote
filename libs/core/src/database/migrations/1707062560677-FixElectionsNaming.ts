import { MigrationInterface, QueryRunner } from "typeorm";

export class FixElectionsNaming1707062560677 implements MigrationInterface {
    name = 'FixElectionsNaming1707062560677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
