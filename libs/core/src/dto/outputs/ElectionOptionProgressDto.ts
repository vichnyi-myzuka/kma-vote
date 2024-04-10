import { ElectionOption } from '@libs/core/database/entities';

export class ElectionOptionProgressDto {
  constructor(option: ElectionOption, progress: number) {
    this.option = option;
    this.progress = progress;
  }

  public option: ElectionOption;
  public progress: number;
}
