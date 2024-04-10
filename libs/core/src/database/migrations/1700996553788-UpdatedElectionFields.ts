import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedElectionFields1700996553788 implements MigrationInterface {
    name = 'UpdatedElectionFields1700996553788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election" ADD "hide" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "election" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ADD "endDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ADD "status" character varying NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "hide"`);
    }

}
