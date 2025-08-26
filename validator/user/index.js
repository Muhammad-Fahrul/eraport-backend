import InvariantError from '../../error/InvariantError.js';
import {
  AuthPayloadSchema,
  UserPayloadSchema,
  UserUpdatePayloadSchema,
} from './schema.js';

export default {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAuthPayload: (payload) => {
    const validationResult = AuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserUpdatePayload: (payload) => {
    const validationResult = UserUpdatePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
