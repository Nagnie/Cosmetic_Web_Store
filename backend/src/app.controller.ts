import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './helpers/decorator/public';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  // Test redis is working
  @Get('test-session')
  @Public()
  async testSession(@Req() req: Request & { session: any }, @Res() res: Response) {
    if (req.session.views) {
      req.session.views++;
    } else {
      req.session.views = 1;
    }
    res.json({ message: 'Session is working!', views: req.session.views });
  }
}
