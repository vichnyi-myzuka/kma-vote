import { MigrationInterface, QueryRunner } from "typeorm";

export class AddElectionResult1712398866681 implements MigrationInterface {
    name = 'AddElectionResult1712398866681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "election_result" ("id" SERIAL NOT NULL, "student" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "electionId" integer, "optionId" integer, CONSTRAINT "REL_7e9333edd1e44d900f90b64c89" UNIQUE ("optionId"), CONSTRAINT "PK_753e7cbaa708ba039ecad9275cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "election" ADD "resultsId" integer`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "startDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ADD CONSTRAINT "FK_37486d2a9c6ca6eb47fdf6826fe" FOREIGN KEY ("resultsId") REFERENCES "election_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_result" ADD CONSTRAINT "FK_b8d4eee864ae04a91d22816792f" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_result" ADD CONSTRAINT "FK_7e9333edd1e44d900f90b64c89c" FOREIGN KEY ("optionId") REFERENCES "election_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_result" DROP CONSTRAINT "FK_7e9333edd1e44d900f90b64c89c"`);
        await queryRunner.query(`ALTER TABLE "election_result" DROP CONSTRAINT "FK_b8d4eee864ae04a91d22816792f"`);
        await queryRunner.query(`ALTER TABLE "election" DROP CONSTRAINT "FK_37486d2a9c6ca6eb47fdf6826fe"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "startDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" DROP COLUMN "resultsId"`);
        await queryRunner.query(`DROP TABLE "election_result"`);
    }

}
