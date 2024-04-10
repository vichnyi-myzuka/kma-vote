import { MigrationInterface, QueryRunner } from "typeorm";

export class AddElectionVoteTime1712399508980 implements MigrationInterface {
    name = 'AddElectionVoteTime1712399508980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vote" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
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
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "createdAt"`);
    }

}
