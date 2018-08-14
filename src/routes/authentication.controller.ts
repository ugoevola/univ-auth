import { AuthenticationService } from '../services/authentication.service';
import { Controller, Post, Body, ForbiddenException, Header, HttpCode, UsePipes, HttpStatus } from '@nestjs/common';
import { CredentialDto } from '../dto/credential.dto';
import { AccountDto } from '../dto/account.dto';
import { ValidationPipe } from '../common/validations/univ-validation.pipe';
import { Role } from '../repository/schema/role.enum';
import { Roles } from '../security/guards/roles.decorator';

/**
 * Controller permettant de gerer l'authentification
 */
@Controller('/')
export class AuthenticationController {

  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/plain')
  @UsePipes(new ValidationPipe())
  public async authenticate(@Body() account: CredentialDto): Promise<string> {
    const token = await this.authenticationService.authenticate(account.email, account.password);
    if (token) {
      return `Bearer ${token}`;
    } else {
      throw new ForbiddenException('Bad credential');
    }
  }

  @Post('account')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  public async create(@Body() account: AccountDto): Promise<AccountDto> {
    const newAccount = await this.authenticationService.create(account);
    delete newAccount.password;
    return newAccount;
  }
}
