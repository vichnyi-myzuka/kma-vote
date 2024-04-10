import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeElectionCreationUser1707875487623 implements MigrationInterface {
    name = 'ChangeElectionCreationUser1707875487623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_721fe79ddfc32f0a9e10cfe189f"`);
        await queryRunner.query(`ALTER TABLE "election_option" RENAME COLUMN "userId" TO "studentCdoc"`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_640b3092dfa00cf9484c5c85a2a" FOREIGN KEY ("studentCdoc") REFERENCES "students"("cdoc") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_640b3092dfa00cf9484c5c85a2a"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" RENAME COLUMN "studentCdoc" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_721fe79ddfc32f0a9e10cfe189f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
