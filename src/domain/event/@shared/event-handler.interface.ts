import { EventInterface } from "./event.interface";

export interface EventHandlerInterface<T extends EventInterface=EventInterface> {
  handler(event: T): void;
}