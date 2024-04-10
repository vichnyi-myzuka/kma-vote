import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1678974885293 implements MigrationInterface {
    name = 'Base1678974885293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "sourceId" character varying NOT NULL, "email" character varying DEFAULT NULL, "username" character varying DEFAULT NULL, CONSTRAINT "UQ_4f03dfb5d781260dad8dd6307f4" UNIQUE ("sourceId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
