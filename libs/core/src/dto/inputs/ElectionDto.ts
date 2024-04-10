import { ScenarioFilter } from '@libs/core/database/types';
import { ElectionStatus } from '@libs/core/database/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ElectionDto {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public description?: string;

  @ApiProperty()
  public urlKey: string;

  @ApiProperty()
  public minSelectedOptions: number;

  @ApiProperty()
  public maxSelectedOptions: number;

  @ApiProperty()
  public accessScenarioParams: ScenarioFilter;

  @ApiProperty()
  public hide: boolean;

  @ApiProperty()
  public startDate: Date;

  @ApiProperty()
  public endDate: Date;

  @ApiProperty()
  public status: ElectionStatus;
}
