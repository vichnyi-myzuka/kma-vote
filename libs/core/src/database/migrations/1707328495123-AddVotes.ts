import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVotes1707328495123 implements MigrationInterface {
    name = 'AddVotes1707328495123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote_options_election_option" ("voteId" integer NOT NULL, "electionOptionId" integer NOT NULL, CONSTRAINT "PK_26d835fa54a262e0b6daba13c19" PRIMARY KEY ("voteId", "electionOptionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_488d467a1a49dc6dd8aaf46a64" ON "vote_options_election_option" ("voteId") `);
        await queryRunner.query(`CREATE INDEX "IDX_56d2201826f59dfacd536172f0" ON "vote_options_election_option" ("electionOptionId") `);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_options_election_option" ADD CONSTRAINT "FK_488d467a1a49dc6dd8aaf46a647" FOREIGN KEY ("voteId") REFERENCES "vote"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "vote_options_election_option" ADD CONSTRAINT "FK_56d2201826f59dfacd536172f09" FOREIGN KEY ("electionOptionId") REFERENCES "election_option"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote_options_election_option" DROP CONSTRAINT "FK_56d2201826f59dfacd536172f09"`);
        await queryRunner.query(`ALTER TABLE "vote_options_election_option" DROP CONSTRAINT "FK_488d467a1a49dc6dd8aaf46a647"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election_option" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "election" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56d2201826f59dfacd536172f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_488d467a1a49dc6dd8aaf46a64"`);
        await queryRunner.query(`DROP TABLE "vote_options_election_option"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }

}
