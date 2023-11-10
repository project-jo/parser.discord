import { Client } from "./client.js";

/**
 * Represents the callback of an event.
 */
type EventCallback = (client: Client, ...args: any) => unknown;

/**
 * A builder that creates API-compatible JSON data for events.
 */
export default class EventBuilder {
  /**
   * The name of this event.
   */
  public readonly name: string = undefined!;

  /**
   * Whether this command is run once or on.
   */
  public readonly once: boolean = false;

  /**
   * The callback of this event.
   */
  public readonly callback: EventCallback = undefined!;

  /**
   * Creates a new event.
   *
   * @param once - Whether to run once or on
   */
  constructor(once = false) {
    Reflect.set(this, 'once', once);
  }

  /**
   * Sets the name of this event.
   *
   * @param name - The name to use
   */
  setName(name: string): this {
    Reflect.set(this, 'name', name);
    return this;
  }
  
  /**
   * Sets the callback of this event.
   *
   * @param callback - The callback to use
   */
  setCallback(callback: EventCallback): this {
    Reflect.set(this, 'callback', callback);
    return this;
  }
}
