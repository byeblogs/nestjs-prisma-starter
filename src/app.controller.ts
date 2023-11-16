import { Controller, Get, Param, Request } from '@nestjs/common';
import { AppService } from './app.service';
import {
  FacebookAuthResult,
  GoogleAuthResult,
  UseFacebookAuth,
  UseGoogleAuth,
} from '@nestjs-hybrid-auth/all';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }

  @UseFacebookAuth()
  @Get('auth/facebook')
  loginWithFacebook() {
    return 'Login with Facebook';
  }

  @UseFacebookAuth()
  @Get('auth/facebook-login/callback')
  facebookCallback(@Request() req): Partial<FacebookAuthResult> {
    const result: FacebookAuthResult = req.hybridAuthResult;
    console.log('FacebookAuthResult : ', result);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      profile: result.profile,
    };
  }

  @UseGoogleAuth()
  @Get('auth/google')
  loginWithGoogle() {
    return 'Login with Google';
  }

  @UseGoogleAuth()
  @Get('auth/google-login/callback')
  googleCallback(@Request() req): Partial<GoogleAuthResult> {
    const result: GoogleAuthResult = req.hybridAuthResult;
    console.log('GoogleAuthResult : ', result);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      profile: result.profile,
    };
  }
}
