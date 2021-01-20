import { container } from 'tsyringe';

import DiskStorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
