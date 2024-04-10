import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToElectionOption1707062043443 implements MigrationInterface {
    name = 'AddUserIdToElectionOption1707062043443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" RENAME COLUMN "name" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_721fe79ddfc32f0a9e10cfe189f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_721fe79ddfc32f0a9e10cfe189f"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" RENAME COLUMN "userId" TO "name"`);
    }

}
