import {Message} from "./Database";

type WorkerId = number;
type ItemKey = string;
type MessageId = string;

export class Queue {
    private readonly messages: Map<ItemKey, Message[]>; // Messages by item keys.
    private readonly workerAssignments: Map<WorkerId, ItemKey | null>; // Assigned workers and item keys.
    private readonly unassignedKeys: Set<ItemKey>; // The item keys those are not assigned to workers yet.
    private messagesCount: number = 0; // To not calculate messages over the Map. Let's keep counter.

    constructor() {
        this.messages = new Map();
        this.workerAssignments = new Map();
        this.unassignedKeys = new Set();
    }

    Enqueue = (message: Message) => {
        if (!this.messages.has(message.key)) {
            this.messages.set(message.key, []);
        }

        const itemMessages = this.messages.get(message.key);

        itemMessages.push(message)
        this.messages.set(message.key, itemMessages)

        this.unassignedKeys.add(message.key);
        this.messagesCount++;
    }

    Dequeue = (workerId: number): Message | undefined => {
        return this.getNextMessage(workerId)
    }

    Confirm = (workerId: WorkerId, messageId: MessageId) => {
        const itemKey = this.workerAssignments.get(workerId);
        const messages = this.messages.get(itemKey);

        if (!messages?.length) {
            this.workerAssignments.delete(workerId);
            this.messages.delete(itemKey);
        }
    }

    Size = () => {
        return this.messagesCount;
    }

    private getNextUnassignedKey(): string | null {
        const [key] = this.unassignedKeys;

        if (!key) {
            return null;
        }

        this.unassignedKeys.delete(key);

        return key;
    }

    private getNextMessage(workerId: WorkerId): Message | undefined {
        if (!this.workerAssignments.has(workerId)) {
            const key = this.getNextUnassignedKey();

            if (!key) {
                return undefined;
            }

            this.assignKeyToWorker(workerId, key);
        }

        const itemKey = this.workerAssignments.get(workerId);
        const messages = this.messages.get(itemKey);
        const message = messages.splice(0, 1)[0];

        if (!message) {
            return undefined;
        }

        this.messages.set(itemKey, messages);

        this.messagesCount--;

        return message;
    }

    private assignKeyToWorker(workerId: WorkerId, itemKey: ItemKey): void {
        this.workerAssignments.set(workerId, itemKey);
    }
}
