import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller('system')
export class SystemController {
  @Get('debug')
  public debug(): { uptime: number } {
    return { uptime: process.uptime() };
  }
}
