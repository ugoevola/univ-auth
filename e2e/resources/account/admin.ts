import { AccountDto } from '../../../src/dto/account.dto';
import { Role } from '../../../src/repository/schema/role.enum';

const accountDto: AccountDto = {
  email: 'admin@test.fr',
  name: 'admin',
  role: Role.ADMIN,
  password : 'admin'
};

export default accountDto;
