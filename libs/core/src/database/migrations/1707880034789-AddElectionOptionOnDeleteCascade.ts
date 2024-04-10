import { MigrationInterface, QueryRunner } from "typeorm";

export class AddElectionOptionOnDeleteCascade1707880034789 implements MigrationInterface {
    name = 'AddElectionOptionOnDeleteCascade1707880034789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_a6439ebd11653d0b7338c3ea3e8"`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_a6439ebd11653d0b7338c3ea3e8" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_option" DROP CONSTRAINT "FK_a6439ebd11653d0b7338c3ea3e8"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ADD CONSTRAINT "FK_a6439ebd11653d0b7338c3ea3e8" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
