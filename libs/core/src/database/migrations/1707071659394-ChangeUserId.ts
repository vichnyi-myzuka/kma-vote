import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserId1707071659394 implements MigrationInterface {
    name = 'ChangeUserId1707071659394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "PK_57a0654b536139c7f9e866dcd96"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "cdoc"`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "studentCdoc" integer`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "UQ_24e7a336d3c693270701125e84c" UNIQUE ("studentCdoc")`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_24e7a336d3c693270701125e84c" FOREIGN KEY ("studentCdoc") REFERENCES "students"("cdoc") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_24e7a336d3c693270701125e84c"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "UQ_24e7a336d3c693270701125e84c"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "studentCdoc"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "PK_e032310bcef831fb83101899b10"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "cdoc" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "PK_57a0654b536139c7f9e866dcd96" PRIMARY KEY ("cdoc")`);
    }

}
