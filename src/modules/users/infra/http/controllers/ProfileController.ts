import { Request, Response } from 'express';

import { container } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);
    const userProfile: Partial<User> = await showProfile.execute({ user_id });

    delete userProfile.password;

    return response.json(userProfile);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const updatedUser: Partial<User> = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  }
}

export default ProfileController;
