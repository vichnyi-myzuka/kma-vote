import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Election } from '@libs/core/database/entities';
import { ElectionStatus } from '@libs/core';
import { ElectionService } from '@app/kma-vote/modules/election/services';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Election, 'main')
    private electionRepository: Repository<Election>,
    private readonly electionService: ElectionService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  public async updateElectionStatus() {
    console.log('Updating election statuses cron started!');
    await this.updateEndingElections();
    await this.updateStartingElections();
  }

  public async updateEndingElections() {
    const elections = await this.electionRepository.find({
      where: { status: ElectionStatus.IN_PROGRESS },
    });

    await Promise.all(
      elections.map(async (election) => {
        if (election.endDate < new Date()) {
          await this.electionService.complete(election.id);
          console.log(`Election ${election.name} has been completed`);
        }
      }),
    );
  }

  public async updateStartingElections() {
    const elections = await this.electionRepository.find({
      where: { status: ElectionStatus.NOT_STARTED },
    });

    await Promise.all(
      elections.map(async (election) => {
        if (election.startDate < new Date()) {
          await this.electionService.start(election.id);
          console.log(`Election ${election.name} has been started`);
        }
      }),
    );
  }
}
