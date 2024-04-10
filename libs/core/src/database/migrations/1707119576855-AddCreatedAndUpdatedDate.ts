import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAndUpdatedDate1707119576855 implements MigrationInterface {
    name = 'AddCreatedAndUpdatedDate1707119576855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "election" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "election" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "election" ADD CONSTRAINT "UQ_f3ecb2bcb7315c4134b0cec1564" UNIQUE ("createdById")`);
        await queryRunner.query(`ALTER TABLE "election" ADD "updatedById" integer`);
        await queryRunner.query(`ALTER TABLE "election" ADD CONSTRAINT "UQ_ccc5991495edc5b5f847419bd0e" UNIQUE ("updatedById")`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "UQ_c1312a067ea27c385fd2291f418" UNIQUE ("createdById")`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "updatedById" integer`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "UQ_c47ebd22ae465e455d22f19a956" UNIQUE ("updatedById")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "students" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ADD CONSTRAINT "FK_f3ecb2bcb7315c4134b0cec1564" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election" ADD CONSTRAINT "FK_ccc5991495edc5b5f847419bd0e" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_c1312a067ea27c385fd2291f418" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_c47ebd22ae465e455d22f19a956" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_c47ebd22ae465e455d22f19a956"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_c1312a067ea27c385fd2291f418"`);
        await queryRunner.query(`ALTER TABLE "election" DROP CONSTRAINT "FK_ccc5991495edc5b5f847419bd0e"`);
        await queryRunner.query(`ALTER TABLE "election" DROP CONSTRAINT "FK_f3ecb2bcb7315c4134b0cec1564"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "UQ_c47ebd22ae465e455d22f19a956"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "UQ_c1312a067ea27c385fd2291f418"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "election" DROP CONSTRAINT "UQ_ccc5991495edc5b5f847419bd0e"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "election" DROP CONSTRAINT "UQ_f3ecb2bcb7315c4134b0cec1564"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "createdAt"`);
    }

}
