import { OrderService } from '../service/order.service';
import { SecurityService } from '../service/security.service';
import { SocketService } from '../service/socket.service';
import { StoreService } from '../service/store.service';
import { ValidationService } from '../service/validation.service';

// application_services: services that are global through out the application
export const APPLICATION_SERVICES = [
  OrderService,  
  SecurityService,
  SocketService,
  StoreService,
  ValidationService
];