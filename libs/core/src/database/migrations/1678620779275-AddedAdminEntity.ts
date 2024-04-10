import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAdminEntity1678620779275 implements MigrationInterface {
    name = 'AddedAdminEntity1678620779275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("cdoc" integer NOT NULL, "name" character varying, CONSTRAINT "PK_57a0654b536139c7f9e866dcd96" PRIMARY KEY ("cdoc"))`);
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
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
