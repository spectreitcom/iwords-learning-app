import { PrismaTx } from '../../../common/types';

export abstract class AdminUserValidationService {
  abstract isEmailTaken(email: string, tx?: PrismaTx): Promise<boolean>;
  abstract isSuperUser(adminUserId: string, tx?: PrismaTx): Promise<boolean>;
}
