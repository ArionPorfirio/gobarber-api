import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

export default class NotificationsRepository
  implements INotificationsRepository {
  private mongoRepository: MongoRepository<Notification>;

  constructor() {
    this.mongoRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.mongoRepository.create({ recipient_id, content });

    await this.mongoRepository.save(notification);

    return notification;
  }
}
