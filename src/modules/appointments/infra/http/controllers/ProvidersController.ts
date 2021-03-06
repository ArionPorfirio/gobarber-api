import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: logged_user_id } = request.user;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      except_user_id: logged_user_id,
    });

    return response.json(classToClass(providers));
  }
}
