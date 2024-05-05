import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {
  private eventHandler: { [eventName: string]: EventHandlerInterface[] } = {};

  get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
    return this.eventHandler;
  }
  notify(event: EventInterface): void {
    throw new Error("Method not implemented.");
  }

  register(
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ): void {
    if (!this.eventHandler[eventName]) {
      this.eventHandler[eventName] = [];
    }
    this.eventHandler[eventName].push(eventHandler);
  }

  unregister(
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ): void {
    if (this.eventHandler[eventName]) {
      const index = this.eventHandler[eventName].indexOf(eventHandler);
      if (index !== -1) {
        this.eventHandler[eventName].splice(index, 1);
      }
    }
  }
  unregisterAll(): void {
    this.eventHandler = {};
  }
}
